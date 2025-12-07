#!/bin/bash
export LC_ALL=nb_NO.UTF-8

TROLL=$(grep -P "t.{1,5}r.{1,5}o.{1,5}l.{1,5}l" ordliste.txt)
NISSE=$(grep -P "^[^n].*n.{0,2}i.{0,2}s.{0,2}s.{0,2}e.*[^e]$" ordliste.txt)

printf "%s\n%s\n" "$TROLL" "$NISSE" | wc -l
