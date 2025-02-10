from serpapi import GoogleSearch
import pandas as pd

params = {
  "engine": "google_maps",
  "q": "hotel",
  "ll": "@28.704060, 77.102493, 15.1z",
  "type": "search",
  "api_key": "f57f5bf91391871d7e4a44426d93fbf9238020117d6ee868c3db436b95864ae6"
}

search = GoogleSearch(params)
results = search.get_dict()
local_results = results["local_results"]

df = pd.json_normalize(results["local_results"])

columns = ['position', 'title', 'address', 'phone', 'website', 'description', 'amenities','rating', 'reviews','price',
          'type_id', 'type_ids', 'place_id', 'data_id' ,'reviews_link', 'provider_id']
df2 = df[columns]