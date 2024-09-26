import { getConnection, sql } from "../database/connection.js";

// export const getProducts = async (req, res) => {
//   try {
//     const pool = await getConnection();
//     const result = await pool.request().query("SELECT * FROM products");
//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

// export const createNewProduct = async (req, res) => {
//   const { name, description, quantity = 0, price } = req.body;

//   if (description == null || name == null) {
//     return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
//   }

//   try {
//     const pool = await getConnection();

//     const result = await pool
//       .request()
//       .input("name", sql.VarChar, name)
//       .input("description", sql.Text, description)
//       .input("quantity", sql.Int, quantity)
//       .input("price", sql.Decimal, price)
//       .query(
//         "INSERT INTO products (name, description, quantity, price) VALUES (@name,@description,@quantity,@price); SELECT SCOPE_IDENTITY() as id"
//       );

//     res.json({
//       name,
//       description,
//       quantity,
//       price,
//       id: result.recordset[0].id,
//     });
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

// export const getProductById = async (req, res) => {
//   try {
//     const pool = await getConnection();

//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .query("SELECT * FROM products WHERE id = @id");

//     return res.json(result.recordset[0]);
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

// export const deleteProductById = async (req, res) => {
//   try {
//     const pool = await getConnection();

//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .query("DELETE FROM products WHERE id = @id");

//     if (result.rowsAffected[0] === 0) return res.sendStatus(404);

//     return res.sendStatus(204);
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

// export const getTotalProducts = async (req, res) => {
//   const pool = await getConnection();
//   const result = await pool.request().query("SELECT COUNT(*) FROM products");
//   res.json(result.recordset[0][""]);
// };

// export const updateProductById = async (req, res) => {
//   const { description, name, quantity = 0, price } = req.body;

//   if (
//     description == null ||
//     name == null ||
//     quantity == null ||
//     price == null
//   ) {
//     return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
//   }

//   try {
//     const pool = await getConnection();
//     const result = await pool
//       .request()
//       .input("id", req.params.id)
//       .input("name", sql.VarChar, name)
//       .input("description", sql.Text, description)
//       .input("quantity", sql.Int, quantity)
//       .input("price", sql.Decimal, price)
//       .query(
//         "UPDATE products SET name = @name, description = @description, quantity = @quantity, price = @price WHERE id = @id"
//       );

//     if (result.rowsAffected[0] === 0) return res.sendStatus(404);

//     res.json({ name, description, quantity, price, id: req.params.id });
//   } catch (error) {
//     res.status(500);
//     res.send(error.message);
//   }
// };

export const getSubsistemasId = async (req, res) => {
  try {
    const parseId = parseInt(req.params.id);

    if(isNaN(parseId))
        return res.status(400).json({error: 'Bad request, invalid Id'})

    const pool = await getConnection();

    const request = new sql.Request();
    request.input('IdUsuario', sql.Int, req.params.id)
    const result = await request.execute('ProgramaEmergente.PAS_ObtSubsistemaXUsuario')

    if(result.recordset.length === 0){
      return res.status(401).json({ error: "El usuario no tiene asignados subsistemas" }); 
    }

    res.status(200).json({
        data: result.recordset
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const getFolioPeoe = async (req, res) => {
  try {
    const { abrev, year, consec } = req.query;

    if(!abrev || !year || !consec) 
      return res.status(401).json({error: 'Invalid Params'})
    
    const pool = await getConnection();

    const request = new sql.Request();
    request.input('abrev', sql.VarChar, abrev);
    request.input('year', sql.Int, year);
    request.input('consec', sql.Int, consec);

    const result = await request.execute('ProgramaEmergente.PAS_BuscaFolioPEOE');
    
    if(result.recordset.length === 0) 
      return res.status(404).json({error: 'Folio no encontrado'})

    res.status(200).json({
        data : result.recordset
    })
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
}
