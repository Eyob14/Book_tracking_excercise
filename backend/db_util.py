"""
Module for establishing a connection to the database.

This module provides utility functions to extract database configurations from
environment variables and establish a connection to the database.
"""
import os
from urllib.parse import urlparse
import mysql.connector
from fastapi import HTTPException

def get_database_connection():
    """
    Establishes a connection to the database and returns the connection object.
    
    Returns:
        mysql.connector.connection: A MySQL connection object.
    
    Raises:
        HTTPException: If there's an error connecting to the database.
    """
    database_url = os.environ.get("DATABASE_URL")
    parsed_url = urlparse(database_url)
    
    database_config = {
        "user": parsed_url.username,
        "password": parsed_url.password,
        "host": parsed_url.hostname,
        "port": parsed_url.port,
        "database": parsed_url.path.lstrip("/"),
    }
    
    try:
        connection = mysql.connector.connect(**database_config)
        return connection
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to the database: {e}") from e
