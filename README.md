# stig-service
A service to track STIGs

## 1. Scrape STIG List

Scrape the list from [here](http://iase.disa.mil/stigs/Pages/a-z.aspx).  Persist the names and dates so updates can be tracked.  The service should repeat this scrape periodically.

The following regular expression matches the relevant fields at the time of this writing:

```<a href=\"(.*?)\".*?>(.*?)<\/a>.*?<nobr>(.*?)<\/nobr>.*?<td.*?<\/td><td.*?>(.*?)<\/td>```

Match groups are:
1. Download URL
2. Title
3. Date
4. Type (ZIP, PDF, DOCX, etc.)

## 2. Download STIG Zips

Iterate over the list of matches and for any match for which the date is newer than the previous scrape, download the zip using the URL from the first match group of the regular expression above. 

## 3. Extract, Convert and Store STIGs

Extract the downloaded zip files and extract any XML files, transform into JSON (effort TBD, XML is non conforming in some cases) and persist the content (schema TBD) along with the date.

## 4. Implement Retrieval API

TBD, pending creation of the schema from step 3.
