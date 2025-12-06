import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Employees from './Employees.vue';
import AddEmployeeDrawer from '../../components/Staff/AddEmployeeDrawer.vue';
import { useAuthStore } from '../../stores/auth';
import axios from 'axios';

// Mock axios
vi.mock('axios');

// Explicit stub for EmployeeCard
const EmployeeCardStub = {
    name: 'EmployeeCard',
    template: '<div class="employee-card-stub"></div>',
    props: ['employee', 'onEdit', 'onDelete'],
    emits: ['edit', 'delete']
};

describe('Employees.vue', () => {
    let wrapper;

    const mockUsers = [
        { _id: '1', name: 'John Doe', role: 'bartender', email: 'john@example.com' },
        { _id: '2', name: 'Jane Doe', role: 'waiter', email: 'jane@example.com' }
    ];

    beforeEach(async () => {
        // Reset mocks
        vi.clearAllMocks();

        // Mock axios response
        axios.get.mockResolvedValue({ data: mockUsers });

        // Setup Pinia
        setActivePinia(createPinia());
        const authStore = useAuthStore();
        // Set initial state
        authStore.user = { _id: 'admin', organizationId: 'org1', role: 'owner' };
        authStore.token = 'fake-token';

        wrapper = mount(Employees, {
            global: {
                stubs: {
                    AddEmployeeDrawer: true,
                    EmployeeCard: EmployeeCardStub,
                    'a-button': true,
                    'a-spin': true,
                    'a-row': { template: '<div><slot /></div>' },
                    'a-col': { template: '<div><slot /></div>' },
                    'PlusOutlined': true
                }
            }
        });
    });

    it('renders employee cards', async () => {
        await flushPromises();

        // Find by stub definition
        const cards = wrapper.findAllComponents(EmployeeCardStub);
        expect(cards.length).toBe(2);
    });

    it('opens drawer when edit event is emitted from EmployeeCard', async () => {
        await flushPromises();

        const drawer = wrapper.findComponent(AddEmployeeDrawer);
        expect(drawer.exists()).toBe(true);

        // Initially hidden (assuming prop default is false)
        expect(drawer.props('visible')).toBe(false);

        // Find the first card
        const card = wrapper.findComponent(EmployeeCardStub);
        expect(card.exists()).toBe(true);

        // Emit edit event
        const userToIsolate = mockUsers[0];
        await card.vm.$emit('edit', userToIsolate);

        // Assert drawer is now visible
        expect(drawer.props('visible')).toBe(true);

        // Assert drawer receives the correct employee to edit
        expect(drawer.props('employeeToEdit')).toEqual(userToIsolate);
    });
});
