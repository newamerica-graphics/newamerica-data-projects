print("Hello!")
import json
import csv
import psycopg2
import wheel

fips_events = {}

conn = psycopg2.connect("dbname=stormevents user=jacksonk")
cur = conn.cursor()

event_categories = [
	'Flood', 'Severe Ice Storm', 'Severe Storm(s)', 'Snow', 'Tornado', 'Fire', 'Hurricane'
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

	event_type_counts['other'] = sum(raw_event_type_counts.values())

	cur.execute("SELECT DISTINCT county_name FROM fema_declarations WHERE fips='" + fips + "';")
	event_type_counts['county_name'] = cur.fetchone()[0];

	fips_events[fips] = event_type_counts


all_fips_list = getAllFips()

i = 0
for fips in all_fips_list:
	print(i)
	
	if fips[0]:
		getCount(fips[0])

	# if i == 5:
	# 	break

	i += 1


keys = ['fips', 'county_name', 'all', 'other'] + event_categories

with open('femaDeclarations.csv', 'wb') as fema_declarations_file:
    dict_writer = csv.DictWriter(fema_declarations_file, keys)
    dict_writer.writeheader()

    for key, value in fips_events.iteritems():
    	data_object = dict({'fips':key}.items() + value.items())

    	dict_writer.writerow(data_object)

cur.close()
conn.close()