export const generateReceiptHTML = async (transactionId) => {
  try {
    console.log('Generating HTML receipt for transaction:', transactionId);
    
    console.log('=== LOCALSTORAGE DEBUG ===');
    console.log('All localStorage keys:', Object.keys(localStorage));
    console.log('selectedProducts:', localStorage.getItem('selectedProducts'));
    console.log('selectedData:', localStorage.getItem('selectedData'));
    console.log('catalogData:', localStorage.getItem('catalogData'));
    console.log('totalPrice:', localStorage.getItem('totalPrice'));
    console.log('pointName:', localStorage.getItem('pointName'));
    console.log('transactionId:', localStorage.getItem('transactionId'));
    console.log('========================');
    
    const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
    const catalogData = JSON.parse(localStorage.getItem('catalogData') || '{}');
    const totalPrice = localStorage.getItem('totalPrice') || '0';
    const pointName = localStorage.getItem('pointName') || '';
    
    const selectedData = JSON.parse(localStorage.getItem('selectedData') || '[]');
    
    const allPossibleKeys = ['selectedProducts', 'selectedData', 'products', 'orderItems', 'cart'];
    let finalSelectedProducts = [];
    let foundKey = '';
    
    for (const key of allPossibleKeys) {
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      if (data && data.length > 0) {
        finalSelectedProducts = data;
        foundKey = key;
        break;
      }
    }
    
    console.log('Found data in key:', foundKey);
    console.log('Final selected products:', finalSelectedProducts);
    console.log('Catalog data structure:', catalogData);
    console.log('Catalog data keys:', Object.keys(catalogData));
    
    if (finalSelectedProducts.length === 0) {
      console.warn('No selected products found in localStorage');
    }
    
    if (Object.keys(catalogData).length === 0) {
      console.warn('No catalog data found in localStorage');
    }
    
    if (finalSelectedProducts.length === 0) {
      console.log('No items found, adding test items for debugging');
      finalSelectedProducts.push({
        id: 'test1',
        quantity: 2
      });
      catalogData.test1 = {
        name: 'Test Product 1',
        unitPrice: 1.50,
        imageUrl: 'https://via.placeholder.com/30x30/cccccc/000000?text=T1'
      };
      
      console.log('Searching for any product data in localStorage...');
      Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (value && (value.includes('productId') || value.includes('quantity') || value.includes('id'))) {
          console.log(`Found potential product data in key "${key}":`, value);
        }
      });
    }
    
    const receiptHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt - ${transactionId}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                color: #000;
                line-height: 1.4;
                padding: 20px;
                max-width: 400px;
                margin: 0 auto;
                min-height: 100vh;
            }
            
            .receipt-container {
                background: white;
                padding: 30px 25px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            
            .logo {
                text-align: center;
                margin-bottom: 20px;
            }
            
            .logo img {
                max-width: 50px;
                height: auto;
            }
            
            .title {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #000;
                font-family: 'Times New Roman', serif;
            }
            
            .transaction-id {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-bottom: 15px;
            }
            
            .separator {
                height: 1px;
                background: #ddd;
                margin: 15px 0;
            }
            
            .item {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 5px 0;
            }
            
            .item-image {
                width: 30px;
                height: 30px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 10px;
            }
            
            .item-details {
                flex: 1;
                font-size: 11px;
                color: #000;
            }
            
            .item-price {
                font-size: 11px;
                color: #000;
                font-weight: 500;
            }
            
            .total-section {
                text-align: center;
                margin: 20px 0;
                padding-top: 15px;
                border-top: 1px solid #ddd;
            }
            
            .total {
                font-size: 15px;
                font-weight: bold;
                color: #000;
            }
            
            .footer {
                text-align: center;
                margin-top: 25px;
                font-size: 12px;
                color: #666;
            }
            
            @media print {
                body {
                    padding: 0;
                    margin: 0;
                }
                
                .receipt-container {
                    box-shadow: none;
                    border-radius: 0;
                }
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="logo">
                <img src="${window.location.origin}/logo192.png" alt="Logo" onerror="this.style.display='none';">
            </div>
            
            <h1 class="title">Order Summary</h1>
            <div class="transaction-id">Transaction ID : ${transactionId}</div>
            
            <div class="separator"></div>
            
            <div class="items">
                ${finalSelectedProducts.map(item => {
                  console.log('Processing item:', item);
                  const productId = item.productId || item.id;
                  const product = catalogData[productId];
                  console.log('Looking for product with ID:', productId);
                  console.log('Found product:', product);
                  
                  if (product) {
                    const itemPrice = (product.unitPrice || 0) * (item.quantity || 1);
                    const priceText = itemPrice === 0 ? 'Free' : `${itemPrice.toFixed(2)}`;
                    
                    return `
                      <div class="item">
                        <img src="${product.imageUrl || ''}" alt="${product.name}" class="item-image" onerror="this.style.display='none';">
                        <div class="item-details">${product.name || 'Unknown Product'} x ${item.quantity || 1}</div>
                        <div class="item-price">${priceText}</div>
                      </div>
                    `;
                  } else {
                    console.log('No product found for item:', item);
                    return `
                      <div class="item">
                        <div class="item-details">Product ID: ${productId} x ${item.quantity || 1}</div>
                        <div class="item-price">Price unavailable</div>
                      </div>
                    `;
                  }
                }).join('')}
                
                ${finalSelectedProducts.length === 0 ? `
                  <div class="item">
                    <div class="item-details">No items found in order</div>
                    <div class="item-price">-</div>
                  </div>
                ` : ''}
            </div>
            
            <div class="total-section">
                <div class="total">Total - ${parseFloat(totalPrice || 0).toFixed(2)}</div>
            </div>
        
        </div>
        
        <script>
            setTimeout(() => {
                window.print();
            }, 1000);
        </script>
    </body>
    </html>
    `;
    
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    
    window.location.href = blobUrl;
    
    setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
    }, 10000);
    
    console.log('HTML receipt opened in browser');
    return true;
    
  } catch (error) {
    console.error('Error generating HTML receipt:', error);
    throw error;
  }
};