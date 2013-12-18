/*
           888           d8b          
           888           Y8P          
           888                        
   8888b.  88888b.      8888 .d8888b  
      "88b 888 "88b     "888 88K      
  .d888888 888  888      888 "Y8888b. 
  888  888 888 d88P d8b  888      X88 
  "Y888888 88888P"  Y8P  888  88888P' 
                         888          
                        d88P          
                      888P"           
*/
var url     = require('url'),
    fs      = require('fs'),
    exec    = require('child_process').exec,
    colors  = require('colors'),
    async   = require('async'),
    csv     = require('csv'),
    plot    = require('plotter').plot,
    moment  = require('moment');

var config  = require('./config.json');

var output_directory  = url.parse(config.url).hostname+moment().format('.MMDDYYYY.HHmmss');
var benches = [];

if(url.parse(config.url).protocol === 'https:'){
  output_directory = 'https.'+output_directory;
}

config.concurrency_levels.forEach(function(key){
  if (typeof key === 'object'){
    benches.push('ab -n '+key.n+' -c '+key.c+' -g '+output_directory+'/'+key.n+'x'+key.c+'.tsv '+config.url);
  }
  else {
    benches.push('ab -n '+config.requests+' -c '+key+' -g '+output_directory+'/'+config.requests+'x'+key+'.tsv '+config.url);
  }
});

fs.mkdir(output_directory,function(e){
  if(e){
    console.log(e);
  }
  else{
    console.log('Benchmarking'.green);
    exec(benches.join(' && '),function(error, stdout, stderr){
      console.log('Finished Benchmarking'.green);

      var files         = fs.readdirSync(output_directory),
          charting_data = {};
      if(files.length >= 1){
        async.each(files, function(file, callback){
          charting_data[file] = [];
          csv()
            .from.path(output_directory+'/'+file, { delimiter: '\t', escape: '"' })
            .on('record', function(row,index){
              charting_data[file].push(row[5])
            })
            .on('end', function() {
              charting_data[file] = charting_data[file].splice(1, charting_data[file].length); 
              callback();
            });
        }, function(err){
          plot({
            data      : charting_data,
            filename  : output_directory+'/output.pdf',
            title     : config.graph_title,
            xlabel    : 'requests',
            ylabel    : 'response time (ms)',
            style     : 'lines',
            smooth    : 'smooth sbezier'
          });
        });
      }
      else {
        console.log('Apache Bench completed but no files were created.'.red);
      }

    });
  }
});
