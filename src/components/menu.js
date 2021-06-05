export const menuItems = [
    {
        id: 10,
        label: "menuitems.quickbooking.text",
        isTitle: true
    },
    {
        id: 11,
        label: "menuitems.booking.text",
        icon: "mdi mdi-calendar-cursor",
        subItems: [
            {
                id: 1,
                label: "menuitems.booking.list.add",
                link: "/rezervations/create",
                parentId: 11
            },
            {
                id: 2,
                label: "menuitems.booking.list.list",
                link: "/rezervations/list",
                parentId: 11
            }
        ]
    },
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true
    },
    {
        id: 2,
        label: "menuitems.customers.text",
        icon: "mdi mdi-account-multiple",
        subItems: [
            {
                id: 1,
                label: "menuitems.customers.list.add",
                link: "/customers/create",
                parentId: 2
            },
            {
                id: 2,
                label: "menuitems.customers.list.list",
                link: "/customers/list",
                parentId: 2
            }
        ]
    },
    {
        id: 3,
        label: "menuitems.employees.text",
        icon: "mdi mdi-account-details",
        subItems: [
            {
                id: 1,
                label: "menuitems.employees.list.add",
                link: "/employees/create",
                parentId: 3
            },
            {
                id: 2,
                label: "menuitems.employees.list.list",
                link: "/employees/list",
                parentId: 3
            }
        ]
    },
    {
        id: 4,
        label: "menuitems.vehicles.text",
        icon: "mdi mdi-car-arrow-right",
        subItems: [
            {
                id: 1,
                label: "menuitems.vehicles.list.add",
                link: "/vehicles/create",
                parentId: 4
            },
            {
                id: 2,
                label: "menuitems.vehicles.list.list",
                link: "/vehicles/list",
                parentId: 4
            }
        ]
    },
    {
        id: 5,
        label: "menuitems.agencies.text",
        icon: "mdi mdi-card-text",
        subItems: [
            {
                id: 1,
                label: "menuitems.agencies.list.add",
                link: "/agencies/create",
                parentId: 5
            },
            {
                id: 2,
                label: "menuitems.agencies.list.list",
                link: "/agencies/list",
                parentId: 5
            }
        ]
    },
    {
        id: 6,
        label: "menuitems.vehicletypes.text",
        icon: "mdi mdi-car-multiple",
        subItems: [
            {
                id: 1,
                label: "menuitems.vehicletypes.list.add",
                link: "/vehicletypes/create",
                parentId: 6
            },
            {
                id: 2,
                label: "menuitems.vehicletypes.list.list",
                link: "/vehicletypes/list",
                parentId: 6
            }
        ]
    },
    {
        id: 7,
        label: "menuitems.users.text",
        icon: "mdi mdi-account-convert",
        subItems: [
            {
                id: 1,
                label: "menuitems.users.list.add",
                link: "/users/create",
                parentId: 7
            },
            {
                id: 2,
                label: "menuitems.users.list.list",
                link: "/users/list",
                parentId: 7
            }
        ]
    },
    {
        id: 8,
        label: "menuitems.points.text",
        icon: "mdi mdi-map-marker-outline",
        subItems: [
            {
                id: 1,
                label: "menuitems.points.list.add",
                link: "/points/create",
                parentId: 8
            },
            {
                id: 2,
                label: "menuitems.points.list.list",
                link: "/points/list",
                parentId: 8
            }
        ]
    },
    {
        id: 9,
        label: "menuitems.airports.text",
        icon: "mdi mdi-airplane-takeoff",
        subItems: [
            {
                id: 1,
                label: "menuitems.airports.list.add",
                link: "/airports/create",
                parentId: 9
            },
            {
                id: 2,
                label: "menuitems.airports.list.list",
                link: "/airports/list",
                parentId: 9
            }
        ]
    },
]

