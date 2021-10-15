function calPrice(price, taxation, taxationtype, taxationrate, isOneway) {
    let taxrate, tax, total, subtotal;
    if (isOneway == 0) {
        subtotal = parseFloat(price);
    } else if (isOneway == 1) {
        subtotal = parseFloat(price) * 2;
    }

    if (taxation == 1) {
        taxrate = "0." + taxationrate;
        tax = parseFloat(subtotal * taxrate);
        if (taxationtype == 0) {
            total = subtotal + tax;
            return {
                "subtotal": subtotal,
                "tax": tax,
                "total": total
            };
        } else if (taxationtype == 1) {
            total = subtotal - tax;
            return {
                "subtotal": total,
                "tax": tax,
                "total": subtotal
            };
        }

    } else if (taxation == 0) {
        return {
            "subtotal": subtotal,
            "tax": 0,
            "total": subtotal
        };
    }
}

console.log(calPrice(125, 1, 0, 18, 0));