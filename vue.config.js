module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  
  // Allow map tiles from Mapbox to work correctly
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
} 