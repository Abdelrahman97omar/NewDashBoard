from fastapi import Body
import redis 
from fastapi import APIRouter
import mysql.connector
import json

# Create a router for table mode endpoints
router = APIRouter()
r =redis.Redis(host="localhost",port="6379")

@router.get("/tablemode/gettable")
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
    no_of_tables=json.dumps(no_of_tables)  

    return no_of_tables


@router.put("/tablemode/addnewtable")
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
        TABLE_NO=len(no_of_tables)
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


@router.delete("/tablemode/removetable")
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
        # last_table=len(no_of_tables)
        last_table=no_of_tables[-1][0]
        print(f"the last table is{last_table}")
        sql = "DELETE FROM Locations WHERE NUMBER_OF_TABLES = %s"
        val = (str(last_table), )
        mycursor.execute(sql,val)
        mydb.commit()
    except Exception as e:
        print("Error deleting last table:",e)


@router.get("/tablemode/getpoints/{table_no}")
async def get_table_points(table_no):
    import mysql.connector
    import json
    mydb = mysql.connector.connect(
    host="localhost",
    user="robot",
    password="12345",
    database="goals"
    )
    TABLE_NO = table_no
    mycursor = mydb.cursor()
    mycursor.execute(f"SELECT * FROM Locations WHERE TABLE_NO = {TABLE_NO} ")
    no_of_tables = mycursor.fetchone() #[row[0] for row in mycursor.fetchone()] #fetchall() -> fetch all rows of the column
    print(type(no_of_tables))
    print(no_of_tables)
    no_of_tables=json.dumps(no_of_tables)  
    return no_of_tables


@router.patch("/tablemode/updatepoints/{table_number}")
async def update_table_number(table_number: int, commingData: dict = Body(...)):
    import mysql.connector
    import json
    mydb = mysql.connector.connect(
    host="localhost",
    user="robot",
    password="12345",
    database="goals"
    )
    mycursor = mydb.cursor()
    whichPoints= commingData["pointsType"]
    newPoints= commingData["points"]
    print(whichPoints)
    print(newPoints)
    if (whichPoints== "Main"):
            sql = "UPDATE Locations SET X = %s, Y = %s, SETA = %s WHERE TABLE_NO = %s"
    elif(whichPoints=="BackUp_1"):
        sql = "UPDATE Locations SET X_bck_1 = %s, Y_bck_1 = %s, SETA_bck_1 = %s WHERE TABLE_NO = %s"

    elif (whichPoints== "BackUp_2"):
            sql = "UPDATE Locations SET X_bck_2 = %s, Y_bck_2 = %s, SETA_bck_2 = %s WHERE TABLE_NO = %s"
    elif (whichPoints=="BackUp_3"):
        sql = "UPDATE Locations SET X_bck_3 = %s, Y_bck_3 = %s, SETA_bck_3 = %s WHERE TABLE_NO = %s"
    else:
        print("Error wrong Points Type")
        
    val = (newPoints[0],newPoints[1],newPoints[2],table_number)
    mycursor.execute(sql, val)
    mydb.commit()
