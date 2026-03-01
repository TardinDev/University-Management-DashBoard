import type { BaseRecord, DataProvider } from "@refinedev/core";
import { MockSubjects, MockStudents, MockTeachers, MockSchedule, MockGrades } from "@/components/constants/Mock-Data";

type MockDataMap = {
  [key: string]: BaseRecord[];
};

const mockData: MockDataMap = {
  subjects: [...MockSubjects],
  students: [...MockStudents],
  teachers: [...MockTeachers],
  schedule: [...MockSchedule],
  grades: [...MockGrades],
};

function applyFilters(data: BaseRecord[], filters: Array<{ field: string; operator: string; value: unknown }>) {
  if (!filters || filters.length === 0) return data;

  return data.filter((item) => {
    return filters.every((filter) => {
      const fieldValue = item[filter.field];
      const filterValue = filter.value;

      switch (filter.operator) {
        case "eq":
          return fieldValue === filterValue;
        case "ne":
          return fieldValue !== filterValue;
        case "contains":
          return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
        case "gt":
          return Number(fieldValue) > Number(filterValue);
        case "lt":
          return Number(fieldValue) < Number(filterValue);
        case "gte":
          return Number(fieldValue) >= Number(filterValue);
        case "lte":
          return Number(fieldValue) <= Number(filterValue);
        default:
          return true;
      }
    });
  });
}

function applySorters(data: BaseRecord[], sorters: Array<{ field: string; order: string }>) {
  if (!sorters || sorters.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sorter of sorters) {
      const aVal = a[sorter.field];
      const bVal = b[sorter.field];

      if (aVal === bVal) continue;

      const direction = sorter.order === "asc" ? 1 : -1;

      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    }
    return 0;
  });
}

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    let data = [...(mockData[resource] || [])];

    if (filters) {
      const filterArray = filters.map((f) => {
        if ("field" in f) {
          return { field: f.field, operator: f.operator as string, value: f.value };
        }
        return null;
      }).filter(Boolean) as Array<{ field: string; operator: string; value: unknown }>;
      data = applyFilters(data, filterArray);
    }

    if (sorters) {
      data = applySorters(data, sorters as Array<{ field: string; order: string }>);
    }

    const total = data.length;

    if (pagination && pagination.mode !== "off") {
      const pag = pagination as { current?: number; pageSize?: number };
      const current = pag.current || 1;
      const pageSize = pag.pageSize || 10;
      const start = (current - 1) * pageSize;
      data = data.slice(start, start + pageSize);
    }

    return { data: data as never[], total };
  },

  getOne: async ({ resource, id }) => {
    const data = mockData[resource] || [];
    const item = data.find((d) => d.id === Number(id));
    if (!item) throw new Error(`${resource} with id ${id} not found`);
    return { data: item as never };
  },

  create: async ({ resource, variables }) => {
    const data = mockData[resource] || [];
    const maxId = data.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    const newItem = { ...variables, id: maxId + 1 } as BaseRecord;
    mockData[resource] = [...data, newItem];
    return { data: newItem as never };
  },

  update: async ({ resource, id, variables }) => {
    const data = mockData[resource] || [];
    const index = data.findIndex((d) => d.id === Number(id));
    if (index === -1) throw new Error(`${resource} with id ${id} not found`);
    const updated = { ...data[index], ...variables } as BaseRecord;
    data[index] = updated;
    mockData[resource] = [...data];
    return { data: updated as never };
  },

  deleteOne: async ({ resource, id }) => {
    const data = mockData[resource] || [];
    const item = data.find((d) => d.id === Number(id));
    if (!item) throw new Error(`${resource} with id ${id} not found`);
    mockData[resource] = data.filter((d) => d.id !== Number(id));
    return { data: item as never };
  },

  getApiUrl: () => "https://api.fake-rest.refine.dev",
};
