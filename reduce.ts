import { orders } from './reduceData';

interface PayType {
    paidYear: number;
    paidMonth: number;
    paidDate: number;
    name: string;
    totalPrice: number;
}

// const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 };
// console.log('Object로...', Object.entries(obj))
// console.log(Object.entries(obj).map(([key, val]) => { return { name: key, y: val } }));

// // 이렇게 줄여 쓸 수 있다.
// // Object.entries(obj).map(([name, y]) => ({ name, y }))

// console.log(Object.entries(obj).map(([name, y]) => ({ name, y })))



// console.log('orders ???? ', orders)

// const getTotalPaid = () => {
//     if (orders) {
//         const totalPaid = orders
//             .filter((order) => order.isPaid === true)
//             .reduce((a, c) => a + c.totalPrice, 0);
//         return totalPaid.toFixed(2);
//     }
// };
// console.log('getTotalPaid', getTotalPaid());


const getPaidDate = () => {
    if (orders) {
        const newArray = orders.map((order) => {
            if (order.paidAt !== undefined) {
                const obj: PayType = { name: '', paidDate: 0, paidMonth: 0, paidYear: 0, totalPrice: 0 };
                obj["paidMonth"] = new Date(order.paidAt).getUTCMonth() + 1;
                obj["paidDate"] = new Date(order.paidAt).getUTCDate();
                obj["paidYear"] = new Date(order.paidAt).getUTCFullYear();
                obj["name"] = `${new Date(order.paidAt).getUTCDate()}, ${new Date(order.paidAt).toDateString().slice(4, 7)}, ${new Date(order.paidAt).getUTCFullYear()}`
                obj["totalPrice"] = order.totalPrice;
                return obj
            }
            return undefined;
        });
        // console.log('newArray', newArray)


        const pays: (PayType | undefined)[] = newArray;

        console.log('pays: ??', pays)
        // 요거 리듀스 계속 보고 익숙해지기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // const all = pays.reduce((total, pay) => {
        //     console.log('total: ', total)
        //     console.log('pay: ', pay)
        //     if (pay) {
        //         const { paidDate, paidMonth, paidYear } = pay;
        //         const found = total.find((p) => p.paidDate === paidDate && p.paidMonth === paidMonth && p.paidYear === paidYear);
        //         console.log('found??', found)
        //         if (found) {
        //             found.totalPrice += pay.totalPrice;
        //         } else {
        //             total.push(pay);
        //         }
        //     }
        //     return total;
        // }, [] as PayType[]);

        // console.log("선생님작품: ", all);


        // 이거 해보기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const allPayObject = pays.reduce((total, pay) => {
            console.log('total: ', total)
            console.log('pay: ', pay)
            if (pay) {
                const dateString = `${pay.paidYear}-${String(pay.paidMonth).padStart(2, '0')}-${String(pay.paidDate).padStart(2, '0')}`;
                console.log('dateString: ', dateString)
                console.log('total[dateString]', total[dateString])
                if (!total[dateString]) {
                    total[dateString] = pay.totalPrice
                } else {
                    total[dateString] += pay.totalPrice;
                }
            }
            return total;
        }, {} as { [date: string]: number });
        console.log("모든 페이 옵젝: ", allPayObject);


        // return newArray;
    }
}

getPaidDate();