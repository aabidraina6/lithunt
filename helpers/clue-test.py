import pymongo

# MongoDB Atlas connection string
MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.7lzev9q.mongodb.net/LitClubApp?retryWrites=true&w=majority'  # Replace this with your MongoDB Atlas connection string
# Database name
DB_NAME = "LitClubApp2024"

# Define the data to be inserted
data = [
    {"index": i+1, 
     "location": [2619, 9261, 191142, 91412, 1426, 9162, 1629, 241191, 21419, 6241, 8, 88][i], 
     "wrong": f"wrong{i+1}", 
     "right": f"right{i+1}"}
    for i in range(12)
]

# Connect to MongoDB Atlas
client = pymongo.MongoClient(MONGODB_URI)

# Select database
db = client[DB_NAME]

# Select collection
collection = db["cluedatas"]

# Insert data into the collection
collection.insert_many(data)

# Close MongoDB connection
client.close()

print("Data inserted successfully.")
