# ReCAP Visualization

This simple server and D3 visualization script renders data from the [Caselaw Access Project API](https://case.law) and renders it to an html page as an SVG. It belongs as part of a poster creation workflow as the second step in a three step chain.

1. The first step, viewable [here](https://github.com/PublicGoodStudio/recap-harvest), is responsible for harvesting and aggregating data from the CAP API. It consumes the API, and makes it easy to write `.tsv` files containing structure that's consumable by this tool.

2. The second step, this tool, is responsible for reading the simplified `.tsv` files produced in step one, and rendering them as SVG files.

3. The third step in the process involved extracting the SVG from the browser, saving it to disk, and opening it in illustrator to add additional textual and explanatory detail.


## Usage

To use this tool, run through the following steps.

1. After cloning this repository, run `npm install` to download and install the required libraries.

2. Place the `.tsv` you want to render in the `server/static/data` folder in this repository. This directory is served as a statically accessible directory by express, and the front-end D3 code looks for your `.tsv` file here.

3. Look at the `/server/scripts/main.js` file. This is the entry-point for the front-end script. There are three easily controllable parameters here. The `tsvFilename` parameter should be the name of the tsv file you want to visualize. This file should be located in the `server/static/data` directory. The `width` parameter is the final width of the svg in points. The `width` parameter is the final height of the svg in points. Using correct points values for the paper size you'd like to render is helpful once the SVG is in illustrator.

4. After updating the filename and other parameters, run `npm run build` from the command line. This will compile the new javascript with your changes. If you prefer, you may run `npm run watch` instead. This will create a watch server, which will live-reload your styles and front-end scripts, if you're looking to get a bit deeper into the styling or scripting and modify the visualization.

4. In the project directory, run `npm run start` to start the lightweight express server that will parse your `.tsv` and render the resulting SVG visualization.

5. Point your browser to `http://localhost:8080`. You should be able to see the rendered SVG at that url on your machine. If you ran `npm run watch` in step 4, you should be able to adjust styles, and see the visualization hot-updated.

When the visualization is to your liking, you might try [this tool](https://nytimes.github.io/svg-crowbar/) from the New York Times to extract the SVG for print.

If the tool doesn't seem to work (We've experienced a few issues with this tool in the past), the svg styling is self-contained enough that it should be possible to download the SVG manually. Open the inspector, right click on the `svg` element containing your visualization, and click "Copy Element". Then open your favorite text editor and paste the element into it. Finally, just save the new file as a `.svg`. From there, you should be able to open the file in any vector drawing application.


## Attribution

Nic Schumann and Matt Phillips built this on April 29th, 2019 for Public Good Studio in Menlo Park, California.
