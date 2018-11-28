'use strict';

const _ = require('lodash');

const tenant = 'testWrite';
const owner = 103;

const opts = {
    returning: true
};

const systems = [
    '1bada2ce-e379-4e17-9569-8a22e09760af',
    '6749b8cf-1955-42c1-9b48-afc6a0374cd6'
];

exports.up = async q => {

    // these remediations have two issues assigned with two systems each (4 actions)
    const remediations = await q.bulkInsert('remediations', [{
        id: '3d34ed5c-a71f-48ee-b7af-b215f27ae68d',
        name: 'to be deleted',
        tenant,
        owner
    }, {
        id: '3274d99f-511d-4b05-9d88-69934f6bb8ec',
        name: 'to have issue deleted',
        tenant,
        owner
    }, {
        id: '869dccf6-19f1-4c2e-9025-e5b8d9e0faef',
        name: 'to have system deleted',
        tenant,
        owner
    }, {
        id: '022e01be-74f1-4893-b48c-df429fe7d09f',
        name: 'to have resolution selected',
        tenant,
        owner
    }, {
        id: '05860f91-4bc4-4bcf-9e5d-a6db6041ae76',
        name: 'to have actions added',
        tenant,
        owner
    }, {
        id: '06c25d1c-b94f-49ce-b5cc-cd6ceaf6431b',
        name: 'to have overlapping stuff added',
        tenant,
        owner
    }, {
        id: '8b427145-ac9f-4727-9543-76eb140222cd',
        name: 'to be renamed',
        tenant,
        owner
    }], opts);

    const issues = await q.bulkInsert('remediation_issues', _.flatMap(remediations, remediation => [{
        remediation_id: remediation.id,
        issue_id: 'vulnerabilities:CVE_2017_6074_kernel|KERNEL_CVE_2017_6074'
    }, {
        remediation_id: remediation.id,
        issue_id: 'vulnerabilities:CVE-2017-17713'
    }]), opts);

    await q.bulkInsert('remediation_issue_systems', _.flatMap(issues, issue => systems.map(system_id => ({
        system_id,
        remediation_issue_id: issue.id
    }))));

    // empty remediations
    await q.bulkInsert('remediations', [{
        id: '3c1877a0-bbcd-498a-8349-272129dc0b88',
        name: 'empty remediation to have actions added',
        tenant,
        owner
    }, {
        id: '466fc274-16fe-4239-a648-2083ed2e05b0',
        name: 'to be used for validation',
        tenant,
        owner
    }], opts);
};
