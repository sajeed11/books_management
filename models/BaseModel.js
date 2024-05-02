import autoBind from 'auto-bind';
import db from '../database/db.js'

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    autoBind(this);
  }

  async getConnection() {
    return await db.getConnection();
  }

  async create(data) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        const result = await connection.query('INSERT INTO ?? SET ?', [this.tableName, data]);
        const newId = result[0].insertId
        console.log(newId)

        await connection.commit()
        return newId
      } catch (error) {
        await connection.rollback()
        throw error;
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error creating data:', error)
      throw error // Re-throw for handling in the controller
    }
  }

  async readAll(condition = null) {
    const connection = await this.getConnection()

    try {
      let query = `SELECT * FROM ??`
      const params = [this.tableName]

      if (condition) {
        // Build the query with the provided condition
        query += ` WHERE ?`
        params.push(condition)
      }

      const result = await connection.query(query, params)
      return result[0]

    } catch (error) {
      console.error('Error reading data:', error)
      throw error; // Re-throw for handling in the controller
    } finally {
      connection.release()
    }
  }

  async readById(id, condition = null) {
    const connection = await this.getConnection()

    try {
      let query = `SELECT * FROM ?? WHERE id = ?`
      const params = [this.tableName, id];

      if (condition) {
        query += `AND ?`
        params.push(condition)
      }

      const result = await connection.query(query, params)
      if (result[0].length === 0) {
        return null
      } else return result[0]
    } catch (error) {
      console.error('Error reading data by ID:', error)
      throw error // Re-throw for handling in the controller
    } finally {
      connection.release()
    }
  }

  async update(id, data) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('UPDATE ?? SET ? WHERE id = ?', [this.tableName, data, id]);
        await connection.commit()
        return true;
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error updating data:', error)
      throw error; // Re-throw for handling in the controller
    }
  }

  async delete(id) {
    const connection = await this.getConnection()

    try {
      await connection.beginTransaction()

      try {
        await connection.query('DELETE FROM ?? WHERE id = ?', [this.tableName, id]);
        await connection.commit()
        return true
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      throw error; // Re-throw for handling in the controller
    }
  }
}

export default BaseModel
