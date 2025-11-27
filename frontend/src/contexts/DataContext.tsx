"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateId, getFromStorage, saveToStorage } from './utils';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  barcode?: string;
  price: number;
  cost?: number;
  stock: number;
  unit?: string;
  supplierId?: string;
}

export interface Client {
  id: string;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
}

export interface Employee {
  id: string;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface Supplier {
  id: string;
  tradeName: string;
  cnpj?: string;
  email?: string;
  phone?: string;
}

// Storage keys
const STORAGE_KEYS = {
  products: 'vh_products',
  clients: 'vh_clients',
  employees: 'vh_employees',
  suppliers: 'vh_suppliers',
};

// Context type
export interface DataContextType {
  products: Product[];
  clients: Client[];
  employees: Employee[];
  suppliers: Supplier[];
  // Products
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => boolean;
  deleteProduct: (id: string) => boolean;
  // Clients
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: string, client: Partial<Client>) => boolean;
  deleteClient: (id: string) => boolean;
  // Employees
  addEmployee: (employee: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, employee: Partial<Employee>) => boolean;
  deleteEmployee: (id: string) => boolean;
  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Supplier;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => boolean;
  deleteSupplier: (id: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setProducts(getFromStorage<Product>(STORAGE_KEYS.products, []));
    setClients(getFromStorage<Client>(STORAGE_KEYS.clients, []));
    setEmployees(getFromStorage<Employee>(STORAGE_KEYS.employees, []));
    setSuppliers(getFromStorage<Supplier>(STORAGE_KEYS.suppliers, []));
    setIsLoaded(true);
  }, []);

  // Save products to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.products, products);
    }
  }, [products, isLoaded]);

  // Save clients to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.clients, clients);
    }
  }, [clients, isLoaded]);

  // Save employees to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.employees, employees);
    }
  }, [employees, isLoaded]);

  // Save suppliers to localStorage when changed
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.suppliers, suppliers);
    }
  }, [suppliers, isLoaded]);

  // Products CRUD
  const addProduct = useCallback((product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = { ...product, id: generateId() };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: Partial<Product>): boolean => {
    setProducts(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
    return true;
  }, []);

  const deleteProduct = useCallback((id: string): boolean => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  // Clients CRUD
  const addClient = useCallback((client: Omit<Client, 'id'>): Client => {
    const newClient: Client = { ...client, id: generateId() };
    setClients(prev => [...prev, newClient]);
    return newClient;
  }, []);

  const updateClient = useCallback((id: string, data: Partial<Client>): boolean => {
    setClients(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
    return true;
  }, []);

  const deleteClient = useCallback((id: string): boolean => {
    setClients(prev => prev.filter(c => c.id !== id));
    return true;
  }, []);

  // Employees CRUD
  const addEmployee = useCallback((employee: Omit<Employee, 'id'>): Employee => {
    const newEmployee: Employee = { ...employee, id: generateId() };
    setEmployees(prev => [...prev, newEmployee]);
    return newEmployee;
  }, []);

  const updateEmployee = useCallback((id: string, data: Partial<Employee>): boolean => {
    setEmployees(prev => {
      const index = prev.findIndex(e => e.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
    return true;
  }, []);

  const deleteEmployee = useCallback((id: string): boolean => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    return true;
  }, []);

  // Suppliers CRUD
  const addSupplier = useCallback((supplier: Omit<Supplier, 'id'>): Supplier => {
    const newSupplier: Supplier = { ...supplier, id: generateId() };
    setSuppliers(prev => [...prev, newSupplier]);
    return newSupplier;
  }, []);

  const updateSupplier = useCallback((id: string, data: Partial<Supplier>): boolean => {
    setSuppliers(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index === -1) return prev;
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      return updated;
    });
    return true;
  }, []);

  const deleteSupplier = useCallback((id: string): boolean => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    return true;
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        clients,
        employees,
        suppliers,
        addProduct,
        updateProduct,
        deleteProduct,
        addClient,
        updateClient,
        deleteClient,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
