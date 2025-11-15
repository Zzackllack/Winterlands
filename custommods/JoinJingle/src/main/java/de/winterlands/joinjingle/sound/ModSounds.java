package de.winterlands.joinjingle.sound;

import de.winterlands.joinjingle.JoingJingle;
import net.minecraft.core.Holder;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.sounds.SoundEvent;
import net.neoforged.neoforge.registries.DeferredRegister;

public class ModSounds {
    public static final DeferredRegister<SoundEvent> SOUND_EVENTS = DeferredRegister.create(BuiltInRegistries.SOUND_EVENT, JoingJingle.MODID);


    public static final Holder<SoundEvent> JOIN_SOUND =
            SOUND_EVENTS.register("join_sound", () ->
                    SoundEvent.createVariableRangeEvent(ResourceLocation.fromNamespaceAndPath(JoingJingle.MODID, "join_sound"))
            );
}
