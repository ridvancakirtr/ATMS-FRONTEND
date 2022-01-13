export function calPrice(price, taxation, taxationtype, taxationrate, isOneway) {
    let taxrate, tax, total, subtotal;
    if (isOneway == false) {
        subtotal = parseFloat(price);
    } else if (isOneway == true) {
        subtotal = parseFloat(price) * 2;
    }

    if (taxation == true) {
        taxrate = "0." + taxationrate;
        tax = parseFloat(subtotal * taxrate);
        if (taxationtype == true) {
            total = subtotal + tax;
            return {
                "subtotal": subtotal,
                "tax": tax,
                "total": total
            };
        } else if (taxationtype == false) {
            total = subtotal - tax;
            return {
                "subtotal": total,
                "tax": tax,
                "total": subtotal
            };
        }

    } else if (taxation == false) {
        return {
            "subtotal": subtotal,
            "tax": 0,
            "total": subtotal
        };
    }
}

//console.log(calPrice(125, true, false, 18, 0));