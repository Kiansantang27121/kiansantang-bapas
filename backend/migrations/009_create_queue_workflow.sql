-- Migration: Create Queue Workflow Tables
-- Description: Tables for tracking queue workflow, PK assignments, and approvals

-- Table for queue workflow tracking
CREATE TABLE IF NOT EXISTS queue_workflow (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_id INT NOT NULL,
    status ENUM('pending', 'assigned_to_pk', 'approved', 'rejected', 'transferred', 'called', 'completed') DEFAULT 'pending',
    assigned_pk_id INT NULL,
    assigned_by INT NULL, -- petugas yang assign
    assigned_at DATETIME NULL,
    approved_at DATETIME NULL,
    rejected_at DATETIME NULL,
    rejection_reason TEXT NULL,
    called_at DATETIME NULL,
    completed_at DATETIME NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_pk_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table for workflow history (audit trail)
CREATE TABLE IF NOT EXISTS queue_workflow_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    workflow_id INT NOT NULL,
    queue_id INT NOT NULL,
    action ENUM('created', 'assigned', 'approved', 'rejected', 'transferred', 'called', 'completed') NOT NULL,
    from_pk_id INT NULL,
    to_pk_id INT NULL,
    performed_by INT NOT NULL,
    reason TEXT NULL,
    notes TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES queue_workflow(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (from_pk_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (to_pk_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('queue_created', 'pk_assigned', 'pk_approved', 'pk_rejected', 'pk_transferred', 'queue_called') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    queue_id INT NULL,
    workflow_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (queue_id) REFERENCES queues(id) ON DELETE CASCADE,
    FOREIGN KEY (workflow_id) REFERENCES queue_workflow(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_queue_workflow_queue_id ON queue_workflow(queue_id);
CREATE INDEX idx_queue_workflow_status ON queue_workflow(status);
CREATE INDEX idx_queue_workflow_assigned_pk ON queue_workflow(assigned_pk_id);
CREATE INDEX idx_workflow_history_workflow_id ON queue_workflow_history(workflow_id);
CREATE INDEX idx_workflow_history_queue_id ON queue_workflow_history(queue_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
