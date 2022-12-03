Having never made a nodejs console app that took in an argument I did a quick search and used the yargs lib to manage console input as it was well documented. The whole program took me about 25 mins to write and about 30 or so minutes to test/debug. Honestly, most of that testing time was finding a csv generator.

As the description was to be a quick programming test I used the following glaring limits :
There is next to no error checking to validate the csv
I did not handle quotes in the csv
I didn’t create any unit or integration tests
