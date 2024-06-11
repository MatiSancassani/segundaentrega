import path from 'path';

const config = {
    PORT: 8080,
    SERVER: 'Server',
    DIRNAME: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    // Esta función tipo getter nos permite configurar dinámicamente
    // la propiedad UPLOAD_DIR en base al valor de otra propiedad (DIRNAME)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
    get UPLOAD_DIR() { return `${this.DIRNAME}/public/img` }, // Función getter\
    MONGODB_URI: ('mongodb+srv://matisancassani:mati123@cluster0.lcblgku.mongodb.net/SegundaPreEntrega'),
    // MONGODB_URI: ('mongodb+srv://matisancassani:M5i03s98@cluster0.lcblgku.mongodb.net/(nombre de la base de datos)')
    // 
    PRODUCTS_PER_PAGE: 2,
    SECRET: 'coder',
    GITHUB_CLIENT_ID: 'Iv23livty0x0eDKBjIbh',
    GITHUB_CLIENT_SECRET: '806e768925fd9e314caea773da483a3abb333ba3',
    GITHUB_CALLBACK_URL: 'http://localhost:8080/ghlogin'    

}

export default config;