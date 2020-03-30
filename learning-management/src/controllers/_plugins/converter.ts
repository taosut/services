export function convertResponse(data: any = null, isOK: boolean = true, text: string|null = null) {
    return {
        status: isOK,
        message: isOK && !text ? 'Success' : text,
        results: data,
    };
}

export function convertDate(data: any = null, to: any = 'local') {
    if (!data) { return; }
    let arrayData = [];
    if (!Array.isArray(data)) {
        arrayData.push(data);
    } else {
        arrayData = data;
    }

    arrayData = arrayData.map(item => {
        if (item.data && Array.isArray(item.data)) {
            item.data = item.data.map(item1 => {
                if (!item1.created_at) { return item1; }
                const createdAt = item1.created_at ? new Date(item1.created_at).toString() : null;
                const updatedAt = item1.updated_at ? new Date(item1.updated_at).toString() : null;
                const deletedAt = item1.deleted_at ? new Date(item1.deleted_at).toString() : null;

                if (item1.hasOwnProperty('deleted_at')) {
                    return {
                        ...item1,
                        created_at: createdAt,
                        updated_at: updatedAt,
                        deleted_at: deletedAt,
                    };
                } else {
                    return {
                        ...item1,
                        created_at: createdAt,
                        updated_at: updatedAt,
                    };
                }
            });

            return item;
        } else {
            if (!item.created_at) { return item; }
            const createdAt = item.created_at ? new Date(item.created_at).toString() : null;
            const updatedAt = item.updated_at ? new Date(item.updated_at).toString() : null;
            const deletedAt = item.deleted_at ? new Date(item.deleted_at).toString() : null;

            if (item.hasOwnProperty('deleted_at')) {
                return {
                    ...item,
                    created_at: createdAt,
                    updated_at: updatedAt,
                    deleted_at: deletedAt,
                };
            } else {
                return {
                    ...item,
                    created_at: createdAt,
                    updated_at: updatedAt,
                };
            }
        }
    });

    if (!Array.isArray(data)) {
        return arrayData[0];
    } else {
        return arrayData;
    }
}

export function shuffle(a) {
    let j;
    let x;
    let i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function getAssetURL(path, id, fileName) {
    if (!fileName) {
        return null;
    } else {
        return path + '/' + id + '/preview/' + fileName;
    }
}
