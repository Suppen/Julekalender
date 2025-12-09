#!/bin/bash
grep -oP "([aeiouy]|(?<=\d.)[bcdfghjklmnpqrstvwxz](?=.\d)|[^\d\w])" input.txt | tr -d "\n"
