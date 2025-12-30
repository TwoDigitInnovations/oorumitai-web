import axios from "axios";

const staticPages = [
    { url: "https://www.Oorumittai.com/", priority: 1.0 },
    { url: "https://www.Oorumittai.com/AboutUs", priority: 0.8 },
    { url: "https://www.Oorumittai.com/ContactUs", priority: 0.8 },
    { url: "https://www.Oorumittai.com/StoreLocation", priority: 0.7 },
    { url: "https://www.Oorumittai.com/FranchiseOpportunity", priority: 0.7 },
    { url: "https://www.Oorumittai.com/ReturnPolicy", priority: 0.7 },
    { url: "https://www.Oorumittai.com/Termsandcondition", priority: 0.7 },
    { url: "https://www.Oorumittai.com/PrivacyPolicy", priority: 0.7 },
    { url: "https://www.Oorumittai.com/HelpCenter", priority: 0.6 },
    { url: "https://www.Oorumittai.com/ProductRecallInfo", priority: 0.6 },
    { url: "https://www.Oorumittai.com/JoinOurDelievryTeam", priority: 0.6 },
    { url: "https://www.Oorumittai.com/signIn", priority: 0.6 },
    { url: "https://www.Oorumittai.com/AllCategory", priority: 0.6 },
    { url: "https://www.Oorumittai.com/Mybooking", priority: 0.6 },
    { url: "https://www.Oorumittai.com/Myhistory", priority: 0.6 },
    { url: "https://www.Oorumittai.com/account", priority: 0.6 },
    { url: "https://www.Oorumittai.com/editProfile", priority: 0.6 },
    { url: "https://www.Oorumittai.com/forgotPassword", priority: 0.6 },
    { url: "https://www.Oorumittai.com/payment", priority: 0.6 },
    { url: "https://www.Oorumittai.com/signUp", priority: 0.6 },
    { url: "https://www.Oorumittai.com/Favourite", priority: 0.6 },
];

function generateSiteMap(products, categories) {
    return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     
     <!-- Static Pages -->
     ${staticPages
            .map(
                (page) => `
       <url>
         <loc>${page.url}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>weekly</changefreq>
         <priority>${page.priority}</priority>
       </url>`
            )
            .join("")}

     <!-- Product Pages -->
     ${products
            .map(
                (p) => `
       <url>
         <loc>https://www.Oorumittai.com/product-details/${p.slug}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>daily</changefreq>
         <priority>0.7</priority>
       </url>`
            )
            .join("")}

     <!-- Category Pages -->
     ${categories
            .map(
                (c) => `
       <url>
         <loc>https://www.Oorumittai.com/categories/${c.slug}</loc>
         <lastmod>${new Date().toISOString()}</lastmod>
         <changefreq>weekly</changefreq>
         <priority>0.7</priority>
       </url>`
            )
            .join("")}
   </urlset>`;
}

const SiteMap = () => {

};

export async function getServerSideProps({ res }) {
    try {

        const [productsRes, categoriesRes] = await Promise.all([
            axios.get("https://api.Oorumittai.com/v1/api/getProduct"),
            axios.get("https://api.Oorumittai.com/v1/api/getCategory"),
        ]);

        const products = productsRes.data?.data || [];
        const categories = categoriesRes.data?.data || [];

        const sitemap = generateSiteMap(products, categories);

        res.setHeader("Content-Type", "text/xml");
        res.write(sitemap);
        res.end();
    } catch (error) {
        console.error("Error generating sitemap:", error);
    }

    return { props: {} };
}

export default SiteMap;
