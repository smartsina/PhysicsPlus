-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parents_updated_at
    BEFORE UPDATE ON parents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update user XP and level
CREATE OR REPLACE FUNCTION update_user_xp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_correct THEN
        -- Add XP based on question difficulty and confidence
        UPDATE users
        SET xp_points = xp_points + (
            CASE
                WHEN NEW.confidence_level >= 4 THEN 20
                WHEN NEW.confidence_level >= 2 THEN 15
                ELSE 10
            END
        )
        WHERE id = NEW.user_id;
        
        -- Update level (every 100 XP = 1 level)
        UPDATE users
        SET level = FLOOR(xp_points / 100) + 1
        WHERE id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for XP updates
CREATE TRIGGER update_xp_on_answer
    AFTER INSERT ON answers
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp();
