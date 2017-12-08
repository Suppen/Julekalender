#!/bin/bash

# The root node is the only one mentioned only once in the input
# Find all mentions of all nodes, sort them, then pick the one which appears only once
grep -o -E "[a-z]+" input.txt | sort | uniq -u
