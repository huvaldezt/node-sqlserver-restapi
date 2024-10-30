import { getConnection, sql } from '../database/connection.js'

// export const createNewProduct = async (req, res) => {
//   const { name, description, quantity = 0, price } = req.body

//   if (description == null || name == null) {
//     return res.status(400).json({ msg: "Bad Request. Please fill all fields" })
//   }

//   try {
//     await getConnection()

//     const result = await pool
//       .request()
//       .input("name", sql.VarChar, name)
//       .input("description", sql.Text, description)
//       .input("quantity", sql.Int, quantity)
//       .input("price", sql.Decimal, price)
//       .query(
//         "INSERT INTO products (name, description, quantity, price) VALUES (@name,@description,@quantity,@price) SELECT SCOPE_IDENTITY() as id"
//       )

//     res.json({
//       name,
//       description,
//       quantity,
//       price,
//       id: result.recordset[0].id,
//     })
//   } catch (error) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

// export const getProductById = async (req, res) => {
//   try {
//     await getConnection()

//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .query("SELECT * FROM products WHERE id = @id")

//     return res.json(result.recordset[0])
//   } catch (error) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

// export const deleteProductById = async (req, res) => {
//   try {
//     await getConnection()

//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .query("DELETE FROM products WHERE id = @id")

//     if (result.rowsAffected[0] === 0) return res.sendStatus(404)

//     return res.sendStatus(204)
//   } catch (error) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

// export const getTotalProducts = async (req, res) => {
//   await getConnection()
//   const result = await pool.request().query("SELECT COUNT(*) FROM products")
//   res.json(result.recordset[0][""])
// }

// export const updateProductById = async (req, res) => {
//   const { description, name, quantity = 0, price } = req.body

//   if (
//     description == null ||
//     name == null ||
//     quantity == null ||
//     price == null
//   ) {
//     return res.status(400).json({ msg: "Bad Request. Please fill all fields" })
//   }

//   try {
//     await getConnection()
//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .input("name", sql.VarChar, name)
//       .input("description", sql.Text, description)
//       .input("quantity", sql.Int, quantity)
//       .input("price", sql.Decimal, price)
//       .query(
//         "UPDATE products SET name = @name, description = @description, quantity = @quantity, price = @price WHERE id = @id"
//       )

//     if (result.rowsAffected[0] === 0) return res.sendStatus(404)

//     res.json({ name, description, quantity, price, id: req.params.id })
//   } catch (error) {
//     res.status(500)
//     res.send(error.message)
//   }
// }

export const getSubsistemasId = async (req, res) => {
  try {
    const parseId = parseInt(req.params.id)

    if (isNaN(parseId)) {
      return res.status(400).json({ error: 'Bad request, invalid Id' })
    }

    await getConnection()

    const request = new sql.Request()
    request.input('IdUsuario', sql.Int, req.params.id)
    const result = await request.execute('ProgramaEmergente.PAS_ObtSubsistemaXUsuario')

    const data = result.recordset

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Usuario sin subsistemas asignados' })
    }

    const item = data[0]

    // Verificar si el item es un objeto y no es null o undefined
    if (!item || typeof item !== 'object') {
      return res.status(404).json({ error: "El elemento 'data[0]' no es válido" })
    }

    // Si item es válido, puedes seguir con la lógica
    const keys = Object.keys(item)

    if (keys.length === 0 || item[keys[0]] === null) {
      return res.status(404).json({ error: 'El campo está vacío o contiene un valor nulo' })
    }

    res.status(200).json({
      data: result.recordset
    })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const getFolioPeoe = async (req, res) => {
  try {
    const { abrev, year, consec } = req.query

    if (!abrev || !year || !consec) {
      return res.status(401).json({ error: 'Invalid Params' })
    }
    await getConnection()

    const request = new sql.Request()
    request.input('abrev', sql.VarChar, abrev)
    request.input('year', sql.Int, year)
    request.input('consec', sql.Int, consec)

    const result = await request.execute('ProgramaEmergente.PAS_BuscaFolioPEOE')

    res.status(200).json({
      data: result.recordset
    })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const getEscuelas = async (req, res) => {
  try {
    const sql = "select Id_Escuela, CONCAT(Nombre,' - ',Clave_CT,' - ', Abreviatura_Nombre) as Nombre  from ProgramaEmergente.Escuela where Estatus = 1"
    const pool = await getConnection()
    const result = await pool.request().query(sql)
    res.json(result.recordset)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const getFoliosXNombre = async (req, res) => {
  try {
    const { nombre, paterno, materno } = req.query

    if (!nombre && !paterno && !materno) {
      return res.status(401).json({ error: 'Invalid Params' })
    }

    await getConnection()
    const request = new sql.Request()

    request.input('nombre', sql.VarChar, nombre)
    request.input('paterno', sql.VarChar, paterno)
    request.input('materno', sql.VarChar, materno)
    const result = await request.execute('ProgramaEmergente.PAS_GetFoliosNombre')

    res.status(200).json({
      data: result.recordset
    })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}

export const getFoliosXEscuela = async (req, res) => {
  try {
    const parseId = parseInt(req.params.id)

    if (isNaN(parseId)) {
      return res.status(400).json({ error: 'Bad request, invalid Id' })
    }

    await getConnection()

    const request = new sql.Request()
    request.input('idEsc', sql.Int, req.params.id)
    const result = await request.execute('ProgramaEmergente.PAS_GetFoliosEscuela')

    // const data = result.recordset

    // if (!data || data.length === 0) {
    //   return res.status(404).json({ error: "Usuario sin subsistemas asignados" })
    // }

    // const item = data[0]

    // Verificar si el item es un objeto y no es null o undefined
    // if (!item || typeof item !== 'object') {
    //   return res.status(404).json({ error: "El elemento 'data[0]' no es válido" })
    // }

    // Si item es válido, puedes seguir con la lógica
    // const keys = Object.keys(item)

    // if (keys.length === 0 || item[keys[0]] === null) {
    //   return res.status(404).json({ error: "El campo está vacío o contiene un valor nulo" })
    // }

    res.status(200).json({
      data: result.recordset
    })
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
}
