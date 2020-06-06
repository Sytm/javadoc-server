"use strict";

const ava = require("ava");

ava("string should be 'Hello World'", (t) => {
  t.is(require("../index").string, "Hello World");
});
