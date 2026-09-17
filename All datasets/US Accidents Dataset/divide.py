import csv
import os

input_file = "large_file.csv"

output_files = [
    "part1.csv",
    "part2.csv",
    "part3.csv"
]

# First pass: count data rows
print("Counting rows...")

with open(input_file, "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)

    header = next(reader)

    total_rows = sum(1 for _ in reader)

print(f"Total data rows: {total_rows:,}")

# Calculate rows per file
rows_per_part = (total_rows + 2) // 3

print(f"Rows per part: approximately {rows_per_part:,}")

# Second pass: split the file
print("Splitting file...")

with open(input_file, "r", encoding="utf-8", newline="") as infile:

    reader = csv.reader(infile)
    header = next(reader)

    writers = []
    files = []

    for output_file in output_files:
        f = open(output_file, "w", encoding="utf-8", newline="")
        writer = csv.writer(f)

        writer.writerow(header)

        files.append(f)
        writers.append(writer)

    try:
        for row_number, row in enumerate(reader):

            part = min(row_number // rows_per_part, 2)

            writers[part].writerow(row)

            if row_number % 100000 == 0:
                print(f"Processed {row_number:,} / {total_rows:,}")

    finally:
        for f in files:
            f.close()

print("Done!")

for file in output_files:
    size_gb = os.path.getsize(file) / (1024 ** 3)
    print(f"{file}: {size_gb:.2f} GB")