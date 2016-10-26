print("Hello!")
import json
import csv
import psycopg2
import wheel

fips_events = {}

conn = psycopg2.connect("dbname=stormevents user=jacksonk")
cur = conn.cursor()

event_categories = [
	'Flood', 'Severe Ice Storm', 'Severe Storm(s)', 'Snow', 'Tornado', 'Fire', 'Coastal Storm', 'Freezing', 'Typhoon', 'Earthquake', 'Hurricane'
]

def getAllFips():
	cur.execute("SELECT DISTINCT fips FROM fema_declarations;")
	return list(cur.fetchall())

def formatVal(value):
	print(type(value))
	return int(value.replace("L", ""))

def getCount(fips):
	cur.execute("SELECT incident_type, COUNT(*) FROM fema_declarations WHERE fips='" + fips + "' GROUP BY incident_type;")
	raw_event_type_counts = dict(cur.fetchall())

	event_type_counts = {}
	event_type_counts['all'] = sum(raw_event_type_counts.values())

	for event_category in event_categories:
		if event_category in raw_event_type_counts.keys():
			event_type_counts[event_category] = raw_event_type_counts[event_category]
		else:
			event_type_counts[event_category] = 0

		raw_event_type_counts.pop(event_category, None)

	event_type_counts['Other'] = sum(raw_event_type_counts.values())
	fips_events[fips] = event_type_counts

# def getCountyFips(raw_list, cur, index):
	# combined_fips_list = []
	# for item in raw_list:
	# 	state_fips = item[0].zfill(2)
	# 	cz_fips = format(item[2], '03')
	# 	event_type = item[4]
	# 	if item[1] == "C":
	# 		appendToData(index, state_fips + cz_fips, event_type)
	# 	else:
	# 		# get state abbreviation from state fips abbreviation mapping
	# 		cur.execute("SELECT abbrev FROM stateabbrevfipsmapping WHERE fips=" + "'" + state_fips + "';")
	# 		state_abbrev = list(cur.fetchone())[0]
	# 		state_zone = state_abbrev + cz_fips

	# 		# get fips list from zone fips mapping
	# 		cur.execute("SELECT fips FROM zonefipsmapping WHERE state_zone=" + "'" + state_zone + "';")
	# 		fips_in_zone = cur.fetchall()

	# 		for fips in fips_in_zone:
	# 			appendToData(index, format(fips[0], '05'), event_type)

# def appendToData(billion_dollar_id, fips, event_type):
	# if fips in fips_by_event:
	# 	if fips_by_event[fips][billion_dollar_id]:
	# 		currVals = set(fips_by_event[fips][billion_dollar_id])
	# 		currVals.add(event_type)
	# 		fips_by_event[fips][billion_dollar_id] = list(currVals)
	# 	else:
	# 		fips_by_event[fips][billion_dollar_id] = [event_type]
	# else:
	# 	fips_by_event[fips] = [None] * 142
	#  	fips_by_event[fips][billion_dollar_id] = [event_type]


 #    data = json.load(data_file)
 #    eventsData = data.get('events')
    
 #    conn = psycopg2.connect("dbname=stormevents user=jacksonk")
 #    cur = conn.cursor()


all_fips_list = getAllFips()

i = 0
for fips in all_fips_list:
	print(i)
	
	if fips[0]:
		getCount(fips[0])

	# if i == 5:
	# 	break

	i += 1

# print(fips_events)
# 	query_string = generateQS(item)
# 	cur.execute(query_string)
# 	raw_county_list = cur.fetchall()
# 	fips_list = getCountyFips(raw_county_list, cur, int(item.get('id')))


keys = ['fips', 'all', 'Other'] + event_categories

with open('femaDeclarations.csv', 'wb') as fema_declarations_file:
    dict_writer = csv.DictWriter(fema_declarations_file, keys)
    dict_writer.writeheader()

    for key, value in fips_events.iteritems():
    	data_object = dict({'fips':key}.items() + value.items())

    	dict_writer.writerow(data_object)

cur.close()
conn.close()