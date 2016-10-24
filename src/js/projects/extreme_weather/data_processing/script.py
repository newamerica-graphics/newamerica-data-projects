print("Hello!")
import json
import csv
import psycopg2
import wheel

county_totals = {}
fips_by_year = {}

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

def getCountyFips(raw_list, cur, index):
	combined_fips_list = []
	for item in raw_list:
		state_fips = item[0].zfill(2)
		cz_fips = format(item[2], '03')
		event_type = item[4]
		if item[1] == "C":
			combined_fips_list.append((state_fips + cz_fips, event_type))
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
				combined_fips_list.append((format(fips[0], '05'), event_type))

	return list(combined_fips_list)


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
	fips_list = getCountyFips(raw_county_list, cur, i)
	fips_list_string = str(fips_list).replace("[", "").replace("]", "")
	eventsData[i]['county_fips'] = fips_list_string
	# print(fips_list)
	year = eventsData[i]['begin_date'][:4]

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
	

	# toWrite.append(fips_list_string)
# print(fips_by_year)
keys = eventsData[0].keys()

with open('output.csv', 'wb') as output_file:
    dict_writer = csv.DictWriter(output_file, keys)
    dict_writer.writeheader()
    for row in eventsData:
    	encoded = {k: unicode(v).encode("utf-8") for k, v in row.items()}
    	dict_writer.writerow(encoded)

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
    # for row in fips_by_year:
    # 	encoded = {k: unicode(v).encode("utf-8") for k, v in row.items()}
    # 	dict_writer.writerow(encoded)


cur.close()
conn.close()


