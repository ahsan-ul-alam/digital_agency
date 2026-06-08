export function flattenNav(groups = []) {
    return groups.flatMap((group) => {
        if (group.href) {
            return [{ ...group, group: 'Overview', groupKey: group.key }];
        }

        return (group.children || []).map((item) => ({
            ...item,
            group: group.title,
            groupKey: group.key,
        }));
    });
}
