print("Hello!")
import json
import csv
import psycopg2
import wheel

county_totals = {}
fips_by_year = {}
fips_by_event = [None] * 142

event_group_mappings = {
	"Tornado": "Tornado or Funnel Cloud", 
	"Funnel Cloud": "Tornado or Funnel Cloud",
	"Flood": "Flooding",
	"Flash Flood": "Flooding",
	"Coastal Flood": "Flooding",
	"Thunderstorm Wind":"Wind, Hail, or Lightning",
	"Hail":"Wind, Hail, or Lightning",
	"High Wind":"Wind, Hail, or Lightning",
	"Lightning":"Wind, Hail, or Lightning",
	"Strong Wind":"Wind, Hail, or Lightning",
	"Waterspout":"Wind, Hail, or Lightning",
	"Drought": "Drought",
	"Excessive Heat": "Extreme Heat",
	"Heat": "Extreme Heat",
	"Wildfire": "Wildfire",
	"Blizzard": "Snow Storms or Ice Storms",
	"Winter Storm": "Snow Storms or Ice Storms",
	"Winter Weather": "Snow Storms or Ice Storms",
	"Heavy Snow": "Snow Storms or Ice Storms",
	"Ice Storm": "Snow Storms or Ice Storms",
	"Extreme Cold/Wind Chill": "Cold Weather/Wind Chill or Freezing",
	"Cold/Wind Chill": "Cold Weather/Wind Chill or Freezing",
	"Frost/Freeze": "Cold Weather/Wind Chill or Freezing",
	"Hurricane (Typhoon)": "Tropical Storm", 
	"Tropical Storm": "Tropical Storm",
}

billion_dollar_event_priorities = {
	"Severe Storm": ["Tornado or Funnel Cloud", "Flooding", "Wind, Hail, or Lightning"],
	"Flooding": ["Flooding", "Wind, Hail, or Lightning"],
	"Drought": ["Drought", "Extreme Heat", "Wildfire"],
	"Wildfire": ["Wildfire"],
	"Winter Storm": ["Snow Storms or Ice Storms", "Cold Weather/Wind Chill or Freezing", "Wind, Hail, or Lightning"],
	"Tropical Cyclone": ["Tropical Storm", "Tornado or Funnel Cloud", "Flooding", "Wind, Hail, or Lightning"],
	"Freeze": ["Cold Weather/Wind Chill or Freezing", "Snow Storms or Ice Storms", "Wind, Hail, or Lightning"],
}

def generateQS(item):
	qs = "SELECT state_fips, cz_type, cz_fips, cz_name, event_type FROM stormeventstable WHERE ("
	# states
	states = item.get('states')
	for i, state in enumerate(states.split(', ')):
		if i != 0:
			qs += " or "
		qs += "state='" + state.upper() + "'"

	qs += ") and ("

	# event types
	event_types = item.get('event_types')
	for i, event_type in enumerate(event_types.split(', ')):
		if i != 0:
			qs += " or "
		qs += "event_type='" + event_type + "'"

	qs += ") and "

	qs += "begin_date_time>='"

	begin_date = item.get('begin_date')

	qs += begin_date + " 00:00:00'"
	
	qs += " and "
	qs += "end_date_time<='"

	end_date = item.get('end_date')

	qs += end_date + " 23:59:59'"

	qs += ";"

	return qs

def getCountyFips(raw_list, cur, index, billion_dollar_event_category):
	fips_by_event[index] = {}
	for item in raw_list:
		state_fips = item[0].zfill(2)
		cz_fips = format(item[2], '03')
		event_type = item[4]
		if item[1] == "C":
			appendToData(index, state_fips + cz_fips, event_type, billion_dollar_event_category)
		else:
			# get state abbreviation from state fips abbreviation mapping
			cur.execute("SELECT abbrev FROM stateabbrevfipsmapping WHERE fips=" + "'" + state_fips + "';")
			state_abbrev = list(cur.fetchone())[0]
			state_zone = state_abbrev + cz_fips

			# get fips list from zone fips mapping
			cur.execute("SELECT fips FROM zonefipsmapping WHERE state_zone=" + "'" + state_zone + "';")
			fips_in_zone = cur.fetchall()
			# print(fips_in_zone)

			for fips in fips_in_zone:
				appendToData(index, format(fips[0], '05'), event_type, billion_dollar_event_category)

	# return list(combined_fips_list)

def appendToData(billion_dollar_id, fips, event_type, billion_dollar_event_category):
	if fips in fips_by_event[billion_dollar_id]:
		curr_val_group = fips_by_event[billion_dollar_id][fips]
		fips_by_event[billion_dollar_id][fips] = compareVals(curr_val_group, event_type, billion_dollar_event_category)
	else:
		fips_by_event[billion_dollar_id][fips] = getEventGroupMapping(event_type)
	# if fips in fips_by_event:
	# 	if fips_by_event[fips][billion_dollar_id] != "none":
	# 		currVal = fips_by_event[fips][billion_dollar_id]
	# 		fips_by_event[fips][billion_dollar_id] = compareVals(currVal, event_type, billion_dollar_event_category)
	# 	else:
	# 		fips_by_event[fips][billion_dollar_id] = getEventGroupMapping(event_type)
	# else:
	# 	fips_by_event[fips] = ["none"] * 142
	# 	# for eventId in range(1, 142):
	#  # 		fips_by_event[fips][str(eventId).decode("utf-8")] = None
	#  	fips_by_event[fips][billion_dollar_id] = getEventGroupMapping(event_type)

def compareVals(curr_val_group, new_val, billion_dollar_event_category):
	priority_list = billion_dollar_event_priorities[billion_dollar_event_category]

	if curr_val_group == "Other" and getEventGroupMapping(new_val) == "Other":
		return "Other"
	
	if curr_val_group == "Other":
		return getEventGroupMapping(new_val)

	if getEventGroupMapping(new_val) == "Other":
		return curr_val_group

	
	new_val_group = event_group_mappings[new_val]

	if (curr_val_group not in priority_list):
		return new_val_group

	if (new_val_group not in priority_list):
		return curr_val_group

	# print(priority_list)
	currVal_priority = priority_list.index(curr_val_group)
	new_val_priority = priority_list.index(new_val_group)

	if (currVal_priority < new_val_priority):
		return curr_val_group
	else:
		return new_val_group

def getEventGroupMapping(event_type):
	if (event_type not in event_group_mappings):
		return "Other"
	else:
		return event_group_mappings[event_type]

with open('billion_dollar.json') as data_file:
    data = json.load(data_file)
    eventsData = data.get('events')
    
    conn = psycopg2.connect("dbname=stormevents user=jacksonk")
    cur = conn.cursor()

    # cur.execute("SELECT DISTINCT cz_fips FROM stormeventstable;")
    # all_fips = cur.fetchall()
    # print(all_fips)

for i, item in enumerate(eventsData):
	print(i)
	query_string = generateQS(item)
	# print(query_string)
	cur.execute(query_string)
	raw_county_list = cur.fetchall()
	# print(raw_county_list)
	fips_list = getCountyFips(raw_county_list, cur, int(item.get('id')), item.get('event_category'))
	# fips_list_string = str(fips_list).replace("[", "").replace("]", "")
	# eventsData[i]['county_fips'] = fips_list_string
	# print(fips_list)
	# year = eventsData[i]['begin_date'][:4]

	# for fips in fips_list:
	# 	if fips in fips_by_year:
	# 		fips_by_year[fips][year] = fips_by_year[fips][year] + 1
	# 	else:
	# 		fips_by_year[fips] = {}
	# 		for yearVal in range(1996, 2016):
	# 	 		fips_by_year[fips][str(yearVal).decode("utf-8")] = 0
	# 	 	fips_by_year[fips][year] = 1
	# print(fips_list)

	# print(len(fips_list))
	# print(county_totals)
	# if i == 5:
	# 	break
# print(fips_by_event)
# print(fips_by_event)
	# toWrite.append(fips_list_string)
# print(fips_by_year)
# keys = eventsData[0].keys()

# with open('output.csv', 'wb') as output_file:
#     dict_writer = csv.DictWriter(output_file, keys)
#     dict_writer.writeheader()
#     for row in eventsData:
#     	encoded = {k: unicode(v).encode("utf-8") for k, v in row.items()}
#     	dict_writer.writerow(encoded)

# county_output_keys = 

# with open('county_list.csv', 'wb') as county_output_file:
#     county_output_writer = csv.writer(county_output_file)
#     # dict_writer.writeheader()
#     for key, value in county_totals.items():
#     	 county_output_writer.writerow([key, value])

# yearCountsKeys = fips_by_year['22073'].keys()

# with open('yearCountTotals.csv', 'wb') as year_count_file:
#     dict_writer = csv.DictWriter(year_count_file, yearCountsKeys)
#     dict_writer.writeheader()

#     for k in fips_by_year:
#         dict_writer.writerow({field: fips_by_year[k].get(field) or k for field in yearCountsKeys})

#     for key, value in fips_by_year.iteritems():

#     dict_writer.writerows(fips_by_year)
#     for row in fips_by_year:
#     	encoded = {k: unicode(v).encode("utf-8") for k, v in row.items()}
#     	dict_writer.writerow(encoded)

keys = ["id","fips"]

with open('countyByEvent2.csv', 'wb') as county_by_event_file:
    writer = csv.DictWriter(county_by_event_file, fieldnames=keys)

    # for k in fips_by_event:
    #     dict_writer.writerow({field: fips_by_event[k].get(field) or k for field in keys})
    i = 0
    for row in fips_by_event:
    	writer.writerow({"id":str(i), "fips":str(row)})
    	i += 1
    	# print(key)
    	# print(value)

    # dict_writer.writerows(fips_by_event)
    # for row in fips_by_event:
    # 	print(row)
    # 	encoded = {k: unicode(v).encode("utf-8") for k, v in row.items()}
    # 	dict_writer.writerow(encoded)


cur.close()
conn.close()


