'use strict';

import { livereload } from './livereload-client.js';
import { CasesByDay } from './chart-cases-by-day.js';

livereload();

const tsvFilename = 'cases_by_decision_date_2000_2017.tsv';

// 612 x 796 = 8.5 x ll
// 796 x 1224 = 11 x l7
// 1758 x 2592 = 24 x 36
// 3516 x 5184 = 48 x 72
const width = 612;
const height = 796;

const chart = new CasesByDay( tsvFilename, width, height );

chart.generateVisualization();
