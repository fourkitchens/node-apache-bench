node-apache-bench
=================

### Setup
* Clone the repository and run npm install to get all your dependencies
* Make sure you you have ```gnuplot``` and ```ghostscript``` installed. If you're using homebrew it's as easy as ```brew install gnuplot ghostscript```

### Execution

Included is a file, ```config.json```, which contains all the setup parameters you’ll need to perform repeatable benchmarks against your application. The application iterates over each of the concurrency level values and creates an Apache Bench statement for each of them using the predefined requests value.

![](http://fourkitchens.com/sites/default/files/blog/inline-images/configjson.png)

If you want to mix things up, instead of using a single value in the concurrency_levels array, use an object with N being the number of requests and C being the concurrency.

### Results

![](http://fourkitchens.com/sites/default/files/blog/inline-images/abpreview.png)

The raw results from Apache Bench are saved to a directory, automatically created in the following format, ```hostname.MMDDYYYY.HHmmss```. If you’re testing an HTTPS url, the protocol is automatically prepended to the directory. The combined plots are generated automatically and saved as a PDF to the same directory.
