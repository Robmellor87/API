import csv

# File paths
input_file = 'directors.tsv'
output_file = 'directors_no_nconst.tsv'

# Step 1: Read input and exclude 'nconst' column
with open(input_file, mode='r', encoding='utf-8') as infile, \
     open(output_file, mode='w', encoding='utf-8', newline='') as outfile:

    reader = csv.DictReader(infile, delimiter='\t')
    fieldnames = [field for field in reader.fieldnames if field != 'nconst']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames, delimiter='\t')

    writer.writeheader()

    for row in reader:
        row.pop('nconst', None)  # Remove 'nconst' if it exists
        writer.writerow(row)

print(f"'nconst' column removed and output written to {output_file}")


LOAD DATA INFILE 'directors.tsv'
INTO TABLE directors
FIELDS TERMINATED BY '\t'
LINES TERMINATED BY '\n'
IGNORE 1 LINES;