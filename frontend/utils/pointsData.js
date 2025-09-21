const pointsData = [
    ];

export const addPoints = ({lat, lng, size}) => {
    if(!lat || !lng || !size) return;
    pointsData.push({lat, lng, size})
}

export const getPoints = () => {
    return pointsData
}