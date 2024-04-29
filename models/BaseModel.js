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
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      try {
        await connection.query('INSERT INTO ?? SET ?', [this.tableName, data]);

        await connection.commit();
        return true
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error creating data:', error);
      throw error; // Re-throw for handling in the controller
    }
  }

  async readAll() {
    const connection = await db.getConnection();

    try {
      const result = await connection.query(`SELECT * FROM ??`, [this.tableName]);
      // console.log(result);
      return result[0];
    } catch (error) {
      console.error('Error reading data:', error);
      throw error; // Re-throw for handling in the controller
    } finally {
      connection.release();
    }
  }

  async readById(id) {
    const connection = await db.getConnection();

    try {
      const result = await connection.query(`SELECT * FROM ?? WHERE id = ?`, [
        this.tableName,
        id,
      ]);
      return result[0] || null; // Return first row or null if not found
    } catch (error) {
      console.error('Error reading data by ID:', error);
      throw error; // Re-throw for handling in the controller
    } finally {
      connection.release();
    }
  }

  async update(id, data) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      try {
        await connection.query('UPDATE ?? SET ? WHERE id = ?', [this.tableName, data, id]);
        await connection.commit();
        return true;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error updating data:', error);
      throw error; // Re-throw for handling in the controller
    }
  }

  async delete(id) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      try {
        await connection.query('DELETE FROM ?? WHERE id = ?', [this.tableName, id]);
        await connection.commit();
        return true;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error; // Re-throw for handling in the controller
    }
  }
}

export default BaseModel
