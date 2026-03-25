from fastapi import FastAPI
import redis 
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

r =redis.Redis(host="localhost",port="6379")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ButtonData(BaseModel):
    button_value: str

@app.get("/stausBar/States")
async def returnCurrentStates():
    """
    This endpoint will return all states of the the Status Bar: Mode - Localization - Battery - OperationMode ...
    """  
    CurrentStates=r.get("all_topics")
    print(CurrentStates)
    return CurrentStates



@app.get("/tablemdoe/gettable")
async def getTabledata():
    import mysql.connector
    import json
    mydb = mysql.connector.connect(
    host="localhost",
    user="robot",
    password="12345",
    database="goals"
    )

    mycursor = mydb.cursor()
    mycursor.execute("SELECT TABLE_NO FROM Locations")
    no_of_tables = [row[0] for row in mycursor.fetchall()] #fetchall() -> fetch all rows of the column
    print(type(no_of_tables))
    print(no_of_tables)
    print("=====================================")    
    no_of_tables=json.dumps(no_of_tables)  

    return no_of_tables


@app.put("/tablemdoe/addnewtable")
async def add_new_table(TABLE_NO=None):

    import mysql.connector
    mydb = mysql.connector.connect(
    host="localhost",
    user="robot",
    password="12345",
    database="goals"
    )
    mycursor = mydb.cursor()
    sql=None
    val=None

    if TABLE_NO==None:
        mycursor.execute("SELECT NUMBER_OF_TABLES FROM Locations")
        no_of_tables = mycursor.fetchall() # All rows of the column
        TABLE_NO=len(no_of_tables)+1
    else:
        TABLE_NO=str(TABLE_NO)

    val = (str(TABLE_NO),"0.0","0.0","0.0")
    sql = "INSERT INTO Locations (TABLE_NO,X,Y,SETA) VALUES (%s,%s,%s,%s)"
    try:
        mycursor.execute(sql, val)
        mydb.commit()
    except Exception as e:
        print("Error adding new table in the database: ",e)
    print(mycursor.rowcount, "record inserted.")


@app.delete("/tablemdoe/removetable")
async def remove_table():
    import mysql.connector
    mydb = mysql.connector.connect(
    host="localhost",
    user="robot",
    password="12345",
    database="goals"
    )
    mycursor = mydb.cursor()
    sql=None
    val=None
    try:
        mycursor.execute("SELECT NUMBER_OF_TABLES FROM Locations")
        no_of_tables = mycursor.fetchall() # All rows of the column
        last_table=len(no_of_tables)
        print(f"the last table is{last_table}")
        sql = "DELETE FROM Locations WHERE NUMBER_OF_TABLES = %s"
        val = (str(last_table), )

        mycursor.execute(sql,val)
        mydb.commit()
    except Exception as e:
        print("Error deleting last table:",e)


