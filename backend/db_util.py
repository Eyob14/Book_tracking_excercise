"""
Module for establishing a connection to the database.

This module provides utility functions to extract database configurations from
environment variables and establish a connection to the database.
"""

import os
from urllib.parse import urlparse
import mysql.connector # pylint: disable=import-error
from fastapi import HTTPException

DATABASE_URL = os.environ.get("DATABASE_URL")
parsed_url = urlparse(DATABASE_URL)

DATABASE_CONFIG = {
    "user": parsed_url.username,
    "password": parsed_url.password,
    "host": parsed_url.hostname,
    "port": parsed_url.port,
    "database": parsed_url.path.lstrip("/"),  # Remove the leading `/`
}


def get_db():
    """
    Establish and return a connection to the database.
    
    Returns:
        mysql.connector.connection: A MySQL connection object.
    
    Raises:
        HTTPException: If there's an error connecting to the database.
    """
    try:
        db = mysql.connector.connect(**DATABASE_CONFIG)
        return db
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database connection error {e}") from e
