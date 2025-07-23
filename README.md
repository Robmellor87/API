
web app: https://web-app-zmqy.onrender.com/
if service has been inactive for a while, web app may be unresponsive for ~30s whilst API spins up
---------------------
** How to test API **

Endpoint: https://api-sbot.onrender.com/titles?
QS params: title=
           director=
           year=

eg. https://api-sbot.onrender.com/titles?director=stanley kubrick

nb: periods of downtime will spin down the API service hosted on Render so 1st call may take ~30s to respond.

----------------------

My API / APP project

Goal 1) DONE
Make python scripts to cut up and filter TSV dumps from IMDB, selecting only US/UK films with rating above 6* 
and more than 300 user reviews, essentially cutting out all long tail foreign films, documentaries, musicals 
as to avoid crazy big database

Goal 2) DONE
Host this in a mySQL databse 

Goal 3) DONE
Create hosted API service written in node.js to allow GET querying of movie title, year, director + other logic

Goal 4) DONE
Make simple web app to present user with titles and quiz them on year of release

Goal 5) Add some kind of AI agent (GPT API) to the app (ideas: pixelate and guess poster, describe the plot, provide synopsis...)

Further updates:

- directors list added as a separate table to avoid duplication of IDs/rows
- posters (image URLs sourced from the OMDB project API) added - script built to fetch these and upload to new posters column in sql table 
