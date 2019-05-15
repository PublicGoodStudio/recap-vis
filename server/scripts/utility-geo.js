'use strict';

const ranges = [
  {startYear: 1657, endYear: 1657}, {startYear: 1658, endYear: 1659},
  {startYear: 1660, endYear: 1669}, {startYear: 1670, endYear: 1679},
  {startYear: 1680, endYear: 1689}, {startYear: 1690, endYear: 1699},
  {startYear: 1700, endYear: 1709}, {startYear: 1710, endYear: 1719},
  {startYear: 1720, endYear: 1729}, {startYear: 1730, endYear: 1739},
  {startYear: 1740, endYear: 1749},
  {startYear: 1750, endYear: 1759}, {startYear: 1760, endYear: 1769},
  {startYear: 1770, endYear: 1779}, {startYear: 1780, endYear: 1789},
  {startYear: 1790, endYear: 1799}, {startYear: 1800, endYear: 1809},
  {startYear: 1810, endYear: 1819}, {startYear: 1820, endYear: 1829},
  {startYear: 1830, endYear: 1839}, {startYear: 1840, endYear: 1849},
  {startYear: 1850, endYear: 1859}, {startYear: 1860, endYear: 1869},
  {startYear: 1870, endYear: 1879}, {startYear: 1880, endYear: 1889},
  {startYear: 1890, endYear: 1899}, {startYear: 1900, endYear: 1909},
  {startYear: 1910, endYear: 1919}, {startYear: 1920, endYear: 1929},
  {startYear: 1930, endYear: 1939}, {startYear: 1940, endYear: 1949},
  {startYear: 1950, endYear: 1959}, {startYear: 1960, endYear: 1969},
  {startYear: 1970, endYear: 1979}, {startYear: 1980, endYear: 1989},
  {startYear: 1990, endYear: 1999}, {startYear: 2000, endYear: 2009},
  {startYear: 2010, endYear: 2019}
];

const jurisdictionAssociations = { "01":"ala", "02":"alaska",
          "04":"ariz", "05":"ark", "06":"cal",
          "08":"colo", "09":"conn", "10":"del", "12":"fla", "13":"ga",
          "15":"haw", "16":"idaho", '17':"ill", "18":"ind", "19":"iowa",
          "20":"kan", "21":"ky", "22":"la", "23":"me", "24":"md",
          "25":"mass", "26":"mich", '27':"minn", "28":"miss", "29":"mo",
          "30":"montchr", "31":"neb", "32":"nev", "33":"nh", "34":"nj",
          "35":"nm", "36":"ny", "37":"nc", "38":"nd", "39":"ohio",
          "40":"okla", "41":"or", "42":"pa", "44":"ri", "45":"sc", "46":"sd",
          "47":"tenn", "48":"tex", "49":"utah", "50":"vt", "51":"va",
          "53":"wash", "54":"w-va", "55":"wis", "56":"wyo"};

export { ranges, jurisdictionAssociations };
