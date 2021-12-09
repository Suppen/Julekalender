main =
    print
    . filter (\n ->
          n `mod` niceChildren2019 == rest2019
       && n `mod` niceChildren2021 == rest2021
      )
    . map ((+  rest2020) . (* niceChildren2020))
    $ [maxPerChild, maxPerChild-1..minPerChild]
    where niceChildren2020 = 2807727397
          rest2020 = 2787141611
          niceChildren2019 = 2424154637
          rest2019 = 1854803357
          niceChildren2021 = 2537380333
          rest2021 = 1159251923
          maxPerChild = 2000
          minPerChild = 1
