My API / APP project

Goal 1) DONE
Make python scripts to cut up and filter TSV dumps from IMDB, selecting only US/UK films with rating above 6* 
and more than 300 user reviews, essentially cutting out all long tail foreign films, documentaries, musicals 
as to avoid crazy big database

Goal 2) DONE
Host this in a mySQL databse 

Goal 3) DONE
Create hosted API service written in node.js to allow GET querying of movie title, year, director 

Goal 4) PENDING
Make Android app for a basic movie quiz game for guessing dates, directors etc. Likley in Kotlin. 

Goal 5) Add some kind of AI agent (GPT API) to the app (ideas: pixelate and guess poster, describe the plot, provide synopsis...)

Further updates:

- directors list added as a separate table to avoid duplication of IDs/rows
- posters (image URLs sourced from the OMDB project API) added - script built to fetch these and upload to new posters column in sql table 
