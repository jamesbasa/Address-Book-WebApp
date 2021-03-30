const addressSchema = require( './address.schema.json' );
const validate = require( '../../utils/validate' );
const { serialize, deserialize } = require( '../../utils/message-pack' );
const uuid = require( 'uuid' ).v4;

const redis = require( '../../singletons/redis' );
const ADDRESSES = 'addresses';

// eslint-disable-next-line
const log = console.log;

module.exports = {
  async add( address ) {
    const id = 'addr_' + uuid();

    log( 'creating', id );

    // array of id and address contents
    const withId = {
      id,
      ...address
    };

    try {
      validate( addressSchema, withId );
    }
    catch(error) {
      log( 'could not create', id );
      console.error(error);
      return;
    }

    await redis.HSET( ADDRESSES, withId.id, serialize( withId ));
    log( 'created', id );

    return id;
  },

  async update( id, newData ) {
    log( 'updating', id );

    if (! await redis.HEXISTS( ADDRESSES, id)) {
      log( 'could not update. id does not exist', id );
      return;
    }

    const newAddress = {
      id,
      ...newData
    };

    try {
      validate( addressSchema, newAddress );
    }
    catch(error) {
      log( 'could not update', id );
      console.error(error);
      return -1;
    }

    await redis.HSET( ADDRESSES, newAddress.id, serialize( newAddress ) );
    log( 'updated', id );
    return id;
  },

  async delete( id ) {
    log( 'deleting', id );

    const deleted = await redis.HDEL( ADDRESSES, id );
    if (deleted > 0) log( 'deleted', id );
    else log( 'could not delete', id );

    return deleted;
  },

  async get( id ) {
    log( 'getting', id );

    const res = await redis.HGET( ADDRESSES, id );
    log( 'found', id );

    if ( !res ) {
      log( 'could not get', id );
      return;
    }
    return deserialize( res );
  },

  async getAll() {
    log( 'getting all addresses');

    const addresses = await redis.HGETALL( ADDRESSES );
    log( 'got all addresses');

    if (addresses === null || addresses.length == 0) {
      // no addresses were found
      return;
    }

    return Object.values( addresses )
      .map( ( buffer ) => deserialize( buffer ) );
  },

  async search( searchString = '' ) {
    if (searchString == undefined || searchString == null) {
      searchString = '';
    }

    log( 'searching for', searchString );
    
    // HGETALL returns a list of fields and their values stored in the hash
    // It takes longer with more fields and values stored - O(N)
    // Avoid blocking behavior with HSCAN to spread calls out - O(1) per call

    const addresses = await redis.HGETALL( ADDRESSES );

    try {
      return Object.values( addresses )
        .map( ( buffer ) => deserialize( buffer ) )
        // turns the addresses into a flat string
        .filter( ( address ) => {
          const searchable = Object.values( address ).join( ' ' ).toLowerCase();
          // returns the addresses that include searchString
          return searchable.includes( searchString.toLowerCase() );
        });
    }
    catch(error) {
      log( 'database is empty');
      //console.error(error);
      return;
    }
  },
};
