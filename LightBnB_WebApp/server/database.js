const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = email => {
  return pool.query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(result => result.rows[0])
    .catch(err => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = id => {
  return pool.query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then(result => result.rows[0])
    .catch(err => console.log(err.message));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = user => {
  const { name, password, email } = user;
  return pool.query(`INSERT INTO users (name, password, email) VALUES ($1, $2, $3) RETURNING *;`, [name, password, email])
    .then(result => result.rows[0])
    .catch(err => console.log(err.message));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = (guestId, limit = 10) => {
  // return getAllProperties(null, 2);
  return pool.query(`SELECT * FROM reservations WHERE guest_id = $1 AND now() NOT BETWEEN start_date AND end_date LIMIT $2;`, [guestId, limit])
    .then(result => result.rows)
    .catch(err => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let whereConditions = [];
  
  if (!!options.city) {
    queryParams.push(`%${options.city}%`);
    whereConditions.push(`city ILIKE $${queryParams.length}`);
  }
  if (!!options.minimum_price_per_night) {
    queryParams.push(`${parseFloat(options.minimum_price_per_night) * 100}`);
    whereConditions.push(`cost_per_night >= $${queryParams.length}`);
  }
  if (!!options.maximum_price_per_night) {
    queryParams.push(`${parseFloat(options.maximum_price_per_night) * 100}`);
    whereConditions.push(`cost_per_night <= $${queryParams.length}`);
  }
  if (!!options.minimum_rating) {
    queryParams.push(`${parseInt(options.minimum_rating)}`);
    whereConditions.push(`property_reviews.rating >= $${queryParams.length}`);
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereConditions.push(`owner_id = $${queryParams.length}`);
  }
  if (queryParams.length > 0) {
    queryString += `WHERE ${whereConditions.join(' AND ')}`;
  }
  
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;
  return pool.query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => console.log(err.message));
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = property => {
  const { title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id } = property;
  const queryParams = [title, description, parseInt(number_of_bedrooms, 10), parseInt(number_of_bathrooms, 10), parseInt(parking_spaces, 10), parseFloat(cost_per_night) * 100, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id];
  const queryString = `
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;
  `;
  return pool.query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => console.log(err.message));
};
exports.addProperty = addProperty;
