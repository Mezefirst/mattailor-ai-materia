-- MatTailor AI Database Initialization
-- Create database schema for materials and user data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    composition JSONB NOT NULL,
    properties JSONB NOT NULL,
    performance_score DECIMAL(3,2),
    cost_score DECIMAL(3,2),
    sustainability_score DECIMAL(3,2),
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material properties table
CREATE TABLE IF NOT EXISTS material_properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    property_name VARCHAR(100) NOT NULL,
    property_value DECIMAL(15,6),
    property_unit VARCHAR(50),
    temperature DECIMAL(8,2),
    pressure DECIMAL(8,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User queries table (for ML enhancement)
CREATE TABLE IF NOT EXISTS user_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_text TEXT NOT NULL,
    query_parameters JSONB,
    results JSONB,
    user_feedback INTEGER CHECK (user_feedback >= 1 AND user_feedback <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Supplier information table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    contact_info JSONB,
    materials JSONB,
    sustainability_rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material suppliers relationship
CREATE TABLE IF NOT EXISTS material_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    price_per_kg DECIMAL(10,2),
    minimum_order_kg DECIMAL(10,2),
    lead_time_days INTEGER,
    availability_status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_materials_composition ON materials USING GIN (composition);
CREATE INDEX IF NOT EXISTS idx_materials_properties ON materials USING GIN (properties);
CREATE INDEX IF NOT EXISTS idx_materials_performance ON materials (performance_score);
CREATE INDEX IF NOT EXISTS idx_materials_cost ON materials (cost_score);
CREATE INDEX IF NOT EXISTS idx_materials_sustainability ON materials (sustainability_score);
CREATE INDEX IF NOT EXISTS idx_material_properties_material_id ON material_properties (material_id);
CREATE INDEX IF NOT EXISTS idx_material_properties_name ON material_properties (property_name);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries (created_at);
CREATE INDEX IF NOT EXISTS idx_suppliers_region ON suppliers (region);
CREATE INDEX IF NOT EXISTS idx_material_suppliers_material_id ON material_suppliers (material_id);
CREATE INDEX IF NOT EXISTS idx_material_suppliers_supplier_id ON material_suppliers (supplier_id);

-- Insert sample data
INSERT INTO materials (name, composition, properties, performance_score, cost_score, sustainability_score, source) VALUES
('Steel AISI 1045', '{"Fe": 98.51, "C": 0.45, "Mn": 0.75, "P": 0.04, "S": 0.05}', '{"tensile_strength": 625, "yield_strength": 530, "elongation": 16, "hardness": 201}', 0.85, 0.90, 0.70, 'MatWeb'),
('Aluminum 6061-T6', '{"Al": 97.9, "Mg": 1.0, "Si": 0.6, "Cu": 0.3, "Cr": 0.2}', '{"tensile_strength": 310, "yield_strength": 276, "elongation": 12, "hardness": 95}', 0.80, 0.75, 0.85, 'Materials Project'),
('Titanium Ti-6Al-4V', '{"Ti": 90, "Al": 6, "V": 4}', '{"tensile_strength": 950, "yield_strength": 880, "elongation": 14, "hardness": 334}', 0.95, 0.30, 0.60, 'MatWeb');

INSERT INTO suppliers (name, region, contact_info, materials, sustainability_rating) VALUES
('Nordic Steel AB', 'Europe', '{"email": "contact@nordicsteel.se", "phone": "+46-8-123-4567"}', '["Steel AISI 1045", "Stainless Steel 316"]', 0.85),
('Aluminum Solutions Inc', 'North America', '{"email": "sales@aluminumsolutions.com", "phone": "+1-555-0123"}', '["Aluminum 6061-T6", "Aluminum 7075-T6"]', 0.90),
('Titanium Aerospace Ltd', 'Global', '{"email": "info@titanaero.com", "phone": "+44-20-1234-5678"}', '["Titanium Ti-6Al-4V", "Titanium Ti-6Al-2Sn-4Zr-2Mo"]', 0.75);

-- Insert sample material-supplier relationships
INSERT INTO material_suppliers (material_id, supplier_id, price_per_kg, minimum_order_kg, lead_time_days)
SELECT 
    m.id,
    s.id,
    CASE 
        WHEN m.name LIKE '%Steel%' THEN 2.50
        WHEN m.name LIKE '%Aluminum%' THEN 4.80
        WHEN m.name LIKE '%Titanium%' THEN 35.00
    END,
    CASE 
        WHEN m.name LIKE '%Steel%' THEN 100
        WHEN m.name LIKE '%Aluminum%' THEN 50
        WHEN m.name LIKE '%Titanium%' THEN 10
    END,
    CASE 
        WHEN m.name LIKE '%Steel%' THEN 7
        WHEN m.name LIKE '%Aluminum%' THEN 5
        WHEN m.name LIKE '%Titanium%' THEN 14
    END
FROM materials m
CROSS JOIN suppliers s
WHERE (m.name LIKE '%Steel%' AND s.name LIKE '%Steel%')
   OR (m.name LIKE '%Aluminum%' AND s.name LIKE '%Aluminum%')
   OR (m.name LIKE '%Titanium%' AND s.name LIKE '%Titanium%');