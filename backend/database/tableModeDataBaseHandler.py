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
def create_new_row(TABLE_NO=None):
    global sql,val
    if TABLE_NO==None:
        mycursor.execute("SELECT NUMBER_OF_TABLES FROM Locations")
        no_of_tables = mycursor.fetchall() # All rows of the column
        TABLE_NO=len(no_of_tables)+1
        
    val = (str(TABLE_NO),"0.0","0.0","0.0")
    sql = "INSERT INTO Locations (TABLE_NO,X,Y,SETA) VALUES (%s,%s,%s,%s)"


create_new_row()
mycursor.execute(sql, val)
mydb.commit()

print(mycursor.rowcount, "record inserted.")