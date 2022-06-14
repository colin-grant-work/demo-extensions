const supportedContributionPoints = [
    'comments/comment/context',
    'comments/comment/title',
    'comments/commentThread/context',
    'debug/callstack/context',
    'editor/context',
    'editor/title',
    'editor/title/context',
    'explorer/context',
    'scm/resourceFolder/context',
    'scm/resourceGroup/context',
    'scm/resourceState/context',
    'scm/title',
    'timeline/item/context',
    'view/item/context',
    'view/title',
    'menu-contribution-test.submenu',
];

toCommandId = thing => `menu-contribution-test.${thing.replace(/\//g, '-')}`;
const menus = Object.create(null);
for (const point of supportedContributionPoints) {
    menus[point] = [{ command: toCommandId(point) }];
}
console.log(JSON.stringify({
    activationEvents: supportedContributionPoints.map(point => `onCommand:${toCommandId(point)}`).concat('onCommand:menu-contribution-test.thumbsDown', 'onCommand:menu-contribution-test.thumbsUp'),
    contributes: {
        commands: supportedContributionPoints.map(point => ({ command: toCommandId(point), title: `Appears in: ${point}`, icon: '$(beaker)' })).
            concat({ command: 'menu-contribution-test.thumbsDown', title: 'Make the thumb point down', icon: '$(thumbsup)' }, { command: 'menu-contribution-test.thumbsUp', title: 'Make the thumb point up', icon: '$(thumbsdown)' }),
        menus: supportedContributionPoints.reduce((accumulated, current) => {
            accumulated[current] = [{ command: toCommandId(current) }];
            if (current === 'explorer/context' || current === 'scm/title') {
                accumulated[current].push({ submenu: 'menu-contribution-test.submenu', when: 'resourceExtname == .ts' });
            }
            if (current === 'view/title') {
                accumulated[current].push({ command: 'menu-contribution-test.thumbsDown', when: 'menu-contribution-test.contextKey != thumbsDown', group: 'navigation' }, { command: 'menu-contribution-test.thumbsUp', when: 'menu-contribution-test.contextKey == thumbsDown', group: 'navigation' });
            }
            if (current === 'editor/title') {
                accumulated[current].push({ submenu: 'menu-contribution-test.submenu', when: 'resourceExtname == .ts', group: 'navigation' });
            }
            return accumulated;
        }, Object.create(null)),
        submenus: [{ icon: '$(beaker)', id: 'menu-contribution-test.submenu', label: 'Test Submenu' }]
    }
}));
