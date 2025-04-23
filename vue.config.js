module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/prima-map/'  // Update this to match your deployment subdirectory
    : '/',
  
  // Allow map tiles from Mapbox to work correctly
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  }
} 